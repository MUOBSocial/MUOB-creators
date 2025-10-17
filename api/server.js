const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// CORS configuration - UPDATED with explicit methods and headers
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'https://muobcreators.com',
            'https://www.muobcreators.com',
            'http://localhost:3000',
            'http://localhost:8080'
        ];
        
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Tally API Configuration
const TALLY_API_KEY = process.env.TALLY_API_KEY || 'tly-H4VtyzbbaNnLkFOVWHuMgmugPpm1W8DW';
const TALLY_API_BASE = 'https://api.tally.so';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Database Setup - Railway persistent storage
const dbPath = process.env.RAILWAY_VOLUME_MOUNT_PATH 
    ? path.join(process.env.RAILWAY_VOLUME_MOUNT_PATH, 'muob.db')
    : './muob.db';

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database at:', dbPath);
    }
});

// Create tables
db.serialize(() => {
    // Admins table
    db.run(`CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Briefs table
    db.run(`CREATE TABLE IF NOT EXISTS briefs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tally_form_id TEXT UNIQUE NOT NULL,
        tally_form_name TEXT,
        title TEXT NOT NULL,
        location TEXT,
        tier TEXT,
        requirements TEXT,
        dates TEXT,
        status TEXT DEFAULT 'live',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Applications table
    db.run(`CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        brief_id INTEGER,
        tally_submission_id TEXT UNIQUE NOT NULL,
        email TEXT NOT NULL,
        instagram TEXT,
        portfolio TEXT,
        content_proposal TEXT,
        status TEXT DEFAULT 'submitted',
        admin_feedback TEXT,
        submitted_at DATETIME,
        raw_tally_data TEXT,
        FOREIGN KEY (brief_id) REFERENCES briefs (id)
    )`);

    // Create indexes
    db.run(`CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_applications_brief_id ON applications(brief_id)`);

    // Insert default admin user (admin/admin123)
    const defaultPassword = bcrypt.hashSync('admin123', 10);
    db.run(`INSERT OR IGNORE INTO admins (username, password_hash) VALUES (?, ?)`, 
        ['admin', defaultPassword]);
});

// Helper function to make Tally API requests
async function tallyAPI(endpoint, method = 'GET', data = null) {
    try {
        const response = await axios({
            method,
            url: `${TALLY_API_BASE}${endpoint}`,
            headers: {
                'Authorization': `Bearer ${TALLY_API_KEY}`,
                'Content-Type': 'application/json'
            },
            data
        });
        return response.data;
    } catch (error) {
        console.error('Tally API Error:', error.response?.data || error.message);
        throw error;
    }
}

// Auth Middleware
function authenticateAdmin(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.adminId = decoded.adminId;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

// ==================== ADMIN ENDPOINTS ====================

// Admin login
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM admins WHERE username = ?', [username], async (err, admin) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, admin.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, username: admin.username });
    });
});

// Get all Tally forms
app.get('/api/admin/tally/forms', authenticateAdmin, async (req, res) => {
    try {
        const forms = await tallyAPI('/forms');
        
        // Get existing form IDs that are already connected to briefs
        db.all('SELECT tally_form_id FROM briefs', [], (err, existingBriefs) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            
            const connectedFormIds = existingBriefs.map(b => b.tally_form_id);
            
            // Add connection status to each form
            const formsWithStatus = forms.data.map(form => ({
                ...form,
                isConnected: connectedFormIds.includes(form.id)
            }));
            
            res.json({ forms: formsWithStatus });
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Tally forms' });
    }
});

// Create new brief and import submissions
app.post('/api/admin/briefs', authenticateAdmin, async (req, res) => {
    const { tallyFormId, tallyFormName, title, location, tier, requirements, dates } = req.body;

    try {
        // Create brief
        db.run(
            `INSERT INTO briefs (tally_form_id, tally_form_name, title, location, tier, requirements, dates) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [tallyFormId, tallyFormName, title, location, tier, requirements, dates],
            async function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint')) {
                        return res.status(400).json({ error: 'This form is already connected to a brief' });
                    }
                    return res.status(500).json({ error: 'Failed to create brief' });
                }

                const briefId = this.lastID;

                // Fetch and import existing submissions
                try {
                    const submissions = await tallyAPI(`/forms/${tallyFormId}/submissions`);
                    
                    if (submissions.data && submissions.data.length > 0) {
                        const stmt = db.prepare(
                            `INSERT OR IGNORE INTO applications 
                             (brief_id, tally_submission_id, email, instagram, portfolio, content_proposal, submitted_at, raw_tally_data) 
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
                        );

                        for (const submission of submissions.data) {
                            // Extract common fields - adjust based on your form structure
                            const fields = submission.fields || {};
                            const email = fields.email || fields.Email || '';
                            const instagram = fields.instagram || fields.Instagram || fields['Instagram Handle'] || '';
                            const portfolio = fields.portfolio || fields.Portfolio || fields['Portfolio Links'] || '';
                            const proposal = fields.proposal || fields['Content Proposal'] || '';
                            
                            stmt.run(
                                briefId,
                                submission.id,
                                email,
                                instagram,
                                portfolio,
                                proposal,
                                submission.createdAt,
                                JSON.stringify(submission)
                            );
                        }
                        
                        stmt.finalize();
                    }

                    res.json({ 
                        success: true, 
                        briefId,
                        importedCount: submissions.data ? submissions.data.length : 0 
                    });
                } catch (importError) {
                    console.error('Import error:', importError);
                    res.json({ 
                        success: true, 
                        briefId,
                        importedCount: 0,
                        warning: 'Brief created but failed to import existing submissions' 
                    });
                }
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Failed to create brief' });
    }
});

// Get all briefs
app.get('/api/admin/briefs', authenticateAdmin, (req, res) => {
    db.all(
        `SELECT b.*, COUNT(a.id) as application_count 
         FROM briefs b 
         LEFT JOIN applications a ON b.id = a.brief_id 
         GROUP BY b.id 
         ORDER BY b.created_at DESC`,
        [],
        (err, briefs) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ briefs });
        }
    );
});

// Update brief status
app.put('/api/admin/brief/:id/status', authenticateAdmin, (req, res) => {
    const { status } = req.body;
    
    db.run(
        'UPDATE briefs SET status = ? WHERE id = ?',
        [status, req.params.id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ success: true });
        }
    );
});

// Get all applications with filters
app.get('/api/admin/applications', authenticateAdmin, (req, res) => {
    const { briefId, status, tier } = req.query;
    
    let query = `
        SELECT a.*, b.title as brief_title, b.tier 
        FROM applications a 
        JOIN briefs b ON a.brief_id = b.id 
        WHERE 1=1
    `;
    const params = [];

    if (briefId) {
        query += ' AND a.brief_id = ?';
        params.push(briefId);
    }
    
    if (status) {
        query += ' AND a.status = ?';
        params.push(status);
    }
    
    if (tier) {
        query += ' AND b.tier = ?';
        params.push(tier);
    }

    query += ' ORDER BY a.submitted_at DESC';

    db.all(query, params, (err, applications) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ applications });
    });
});

// Update application status
app.put('/api/admin/application/:id', authenticateAdmin, (req, res) => {
    const { status, adminFeedback } = req.body;
    
    db.run(
        'UPDATE applications SET status = ?, admin_feedback = ? WHERE id = ?',
        [status, adminFeedback, req.params.id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ success: true });
        }
    );
});

// Bulk update applications
app.post('/api/admin/applications/bulk-update', authenticateAdmin, (req, res) => {
    const { applicationIds, status } = req.body;
    
    const placeholders = applicationIds.map(() => '?').join(',');
    db.run(
        `UPDATE applications SET status = ? WHERE id IN (${placeholders})`,
        [status, ...applicationIds],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ success: true, updatedCount: this.changes });
        }
    );
});

// ==================== USER ENDPOINTS ====================

// User login (check email across all applications)
app.post('/api/user/login', (req, res) => {
    const { email } = req.body;
    
    db.all(
        'SELECT * FROM applications WHERE email = ?',
        [email],
        (err, applications) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            
            if (applications.length === 0) {
                return res.status(404).json({ error: 'No applications found with this email' });
            }
            
            const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
            res.json({ token, email });
        }
    );
});

// Get user's applications
app.get('/api/user/applications', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const email = decoded.email;
        
        db.all(
            `SELECT a.*, b.title as brief_title, b.location, b.tier 
             FROM applications a 
             JOIN briefs b ON a.brief_id = b.id 
             WHERE a.email = ? 
             ORDER BY a.submitted_at DESC`,
            [email],
            (err, applications) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }
                res.json({ applications });
            }
        );
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
});

// ==================== WEBHOOK ENDPOINT ====================

// Tally webhook handler
app.post('/api/webhook/tally', async (req, res) => {
    const { eventType, data } = req.body;
    
    if (eventType === 'SUBMISSION_CREATED') {
        const { formId, submissionId } = data;
        
        // Find the brief connected to this form
        db.get(
            'SELECT id FROM briefs WHERE tally_form_id = ?',
            [formId],
            (err, brief) => {
                if (err || !brief) {
                    return res.status(200).json({ received: true });
                }
                
                // Extract fields from submission
                const fields = data.fields || {};
                const email = fields.email || fields.Email || '';
                const instagram = fields.instagram || fields.Instagram || '';
                const portfolio = fields.portfolio || fields.Portfolio || '';
                const proposal = fields.proposal || fields['Content Proposal'] || '';
                
                // Insert application
                db.run(
                    `INSERT OR IGNORE INTO applications 
                     (brief_id, tally_submission_id, email, instagram, portfolio, content_proposal, submitted_at, raw_tally_data) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        brief.id,
                        submissionId,
                        email,
                        instagram,
                        portfolio,
                        proposal,
                        data.createdAt || new Date().toISOString(),
                        JSON.stringify(data)
                    ],
                    (err) => {
                        if (err) {
                            console.error('Failed to insert application:', err);
                        }
                    }
                );
            }
        );
    }
    
    res.status(200).json({ received: true });
});

// ==================== STATS ENDPOINT ====================

// Dashboard statistics
app.get('/api/admin/stats', authenticateAdmin, (req, res) => {
    db.get(
        `SELECT 
            COUNT(DISTINCT b.id) as total_briefs,
            COUNT(CASE WHEN b.status = 'live' THEN 1 END) as live_briefs,
            COUNT(CASE WHEN b.status = 'expired' THEN 1 END) as expired_briefs,
            COUNT(a.id) as total_applications,
            COUNT(CASE WHEN a.status = 'submitted' THEN 1 END) as pending_applications,
            COUNT(CASE WHEN a.status = 'accepted' THEN 1 END) as accepted_applications,
            COUNT(CASE WHEN a.status = 'unsuccessful' THEN 1 END) as unsuccessful_applications
         FROM briefs b
         LEFT JOIN applications a ON b.id = a.brief_id`,
        [],
        (err, stats) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(stats);
        }
    );
});

// Health check endpoint for Railway
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Admin login: admin / admin123`);
    console.log(`Railway deployment ready`);
    console.log(`CORS enabled for:`, corsOptions.origin);
});

// Graceful shutdown for Railway
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

function shutdown() {
    console.log('Shutting down gracefully...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
}
