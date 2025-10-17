const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.connect((err, client, done) => {
    if (err) {
        console.error('Database connection error:', err.stack);
    } else {
        console.log('Connected to PostgreSQL database');
        done();
    }
});

// SIMPLIFIED CORS - Debug version
app.use((req, res, next) => {
    console.log(`[CORS Debug] ${req.method} ${req.path} from origin: ${req.headers.origin}`);
    
    // Set CORS headers for all requests
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        console.log('[CORS Debug] Handling OPTIONS preflight request');
        return res.sendStatus(200);
    }
    
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[Request] ${new Date().toISOString()} - ${req.method} ${req.path}`);
    if (req.method === 'POST' || req.method === 'PUT') {
        console.log('[Request Body]', req.body);
    }
    next();
});

// Tally API Configuration
const TALLY_API_KEY = process.env.TALLY_API_KEY || 'tly-H4VtyzbbaNnLkFOVWHuMgmugPpm1W8DW';
const TALLY_API_BASE = 'https://api.tally.so';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Create tables
async function initializeDatabase() {
    try {
        // Create admins table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS admins (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create briefs table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS briefs (
                id SERIAL PRIMARY KEY,
                tally_form_id VARCHAR(255) UNIQUE NOT NULL,
                tally_form_name VARCHAR(255),
                title VARCHAR(255) NOT NULL,
                location VARCHAR(255),
                tier VARCHAR(50),
                requirements TEXT,
                dates VARCHAR(255),
                status VARCHAR(50) DEFAULT 'live',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create applications table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS applications (
                id SERIAL PRIMARY KEY,
                brief_id INTEGER REFERENCES briefs(id),
                tally_submission_id VARCHAR(255) UNIQUE NOT NULL,
                email VARCHAR(255) NOT NULL,
                instagram VARCHAR(255),
                portfolio VARCHAR(255),
                content_proposal TEXT,
                status VARCHAR(50) DEFAULT 'submitted',
                admin_feedback TEXT,
                submitted_at TIMESTAMP,
                raw_tally_data TEXT
            )
        `);

        // Create indexes
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email)`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_applications_brief_id ON applications(brief_id)`);

        // Insert default admin user (admin/admin123)
        const defaultPassword = await bcrypt.hash('admin123', 10);
        await pool.query(
            `INSERT INTO admins (username, password_hash) 
             VALUES ($1, $2) 
             ON CONFLICT (username) DO NOTHING`,
            ['admin', defaultPassword]
        );

        console.log('Database initialized successfully');
    } catch (err) {
        console.error('Database initialization error:', err);
    }
}

// Initialize database on startup
initializeDatabase();

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

// ==================== TEST ENDPOINTS ====================

// Test endpoint to verify server is running
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Server is running with PostgreSQL',
        cors: 'Debug CORS config active',
        origin: req.headers.origin || 'No origin header',
        timestamp: new Date().toISOString(),
        nodeEnv: process.env.NODE_ENV || 'not set',
        headers: req.headers
    });
});

// Test CORS endpoint
app.post('/api/test-cors', (req, res) => {
    res.json({ 
        message: 'POST request successful',
        receivedBody: req.body,
        origin: req.headers.origin
    });
});

// ==================== ADMIN ENDPOINTS ====================

// Admin login
app.post('/api/admin/login', async (req, res) => {
    console.log('[Login Attempt] Headers:', req.headers);
    console.log('[Login Attempt] Body:', req.body);
    
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        console.log('[Login Error] Missing username or password');
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
        const admin = result.rows[0];

        console.log('[Login] Admin found:', admin ? 'Yes' : 'No');

        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, admin.password_hash);
        console.log('[Login] Password valid:', validPassword);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, { expiresIn: '24h' });
        console.log('[Login Success] Token generated for admin:', admin.username);
        
        res.json({ token, username: admin.username });
    } catch (err) {
        console.error('[Login Error]', err);
        return res.status(500).json({ error: 'Database error' });
    }
});

// Get all Tally forms
app.get('/api/admin/tally/forms', authenticateAdmin, async (req, res) => {
    try {
        const forms = await tallyAPI('/forms');
        
        // Get existing form IDs that are already connected to briefs
        const result = await pool.query('SELECT tally_form_id FROM briefs');
        const connectedFormIds = result.rows.map(b => b.tally_form_id);
        
        // Add connection status to each form
        const formsWithStatus = forms.data.map(form => ({
            ...form,
            isConnected: connectedFormIds.includes(form.id)
        }));
        
        res.json({ forms: formsWithStatus });
    } catch (error) {
        console.error('Error fetching forms:', error);
        res.status(500).json({ error: 'Failed to fetch Tally forms' });
    }
});

// Create new brief and import submissions
app.post('/api/admin/briefs', authenticateAdmin, async (req, res) => {
    const { tallyFormId, tallyFormName, title, location, tier, requirements, dates } = req.body;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Create brief
        const briefResult = await client.query(
            `INSERT INTO briefs (tally_form_id, tally_form_name, title, location, tier, requirements, dates) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING id`,
            [tallyFormId, tallyFormName, title, location, tier, requirements, dates]
        );

        const briefId = briefResult.rows[0].id;

        // Fetch and import existing submissions
        try {
            const submissions = await tallyAPI(`/forms/${tallyFormId}/submissions`);
            
            if (submissions.data && submissions.data.length > 0) {
                for (const submission of submissions.data) {
                    // Extract common fields - adjust based on your form structure
                    const fields = submission.fields || {};
                    const email = fields.email || fields.Email || '';
                    const instagram = fields.instagram || fields.Instagram || fields['Instagram Handle'] || '';
                    const portfolio = fields.portfolio || fields.Portfolio || fields['Portfolio Links'] || '';
                    const proposal = fields.proposal || fields['Content Proposal'] || '';
                    
                    await client.query(
                        `INSERT INTO applications 
                         (brief_id, tally_submission_id, email, instagram, portfolio, content_proposal, submitted_at, raw_tally_data) 
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                         ON CONFLICT (tally_submission_id) DO NOTHING`,
                        [
                            briefId,
                            submission.id,
                            email,
                            instagram,
                            portfolio,
                            proposal,
                            submission.createdAt,
                            JSON.stringify(submission)
                        ]
                    );
                }
            }

            await client.query('COMMIT');
            res.json({ 
                success: true, 
                briefId,
                importedCount: submissions.data ? submissions.data.length : 0 
            });
        } catch (importError) {
            console.error('Import error:', importError);
            await client.query('COMMIT');
            res.json({ 
                success: true, 
                briefId,
                importedCount: 0,
                warning: 'Brief created but failed to import existing submissions' 
            });
        }
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating brief:', error);
        if (error.constraint === 'briefs_tally_form_id_key') {
            return res.status(400).json({ error: 'This form is already connected to a brief' });
        }
        res.status(500).json({ error: 'Failed to create brief' });
    } finally {
        client.release();
    }
});

// Get all briefs
app.get('/api/admin/briefs', authenticateAdmin, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT b.*, COUNT(a.id) as application_count 
             FROM briefs b 
             LEFT JOIN applications a ON b.id = a.brief_id 
             GROUP BY b.id 
             ORDER BY b.created_at DESC`
        );
        res.json({ briefs: result.rows });
    } catch (err) {
        console.error('Error fetching briefs:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});

// Update brief status
app.put('/api/admin/brief/:id/status', authenticateAdmin, async (req, res) => {
    const { status } = req.body;
    
    try {
        await pool.query(
            'UPDATE briefs SET status = $1 WHERE id = $2',
            [status, req.params.id]
        );
        res.json({ success: true });
    } catch (err) {
        console.error('Error updating brief status:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});

// Get all applications with filters
app.get('/api/admin/applications', authenticateAdmin, async (req, res) => {
    const { briefId, status, tier } = req.query;
    
    let query = `
        SELECT a.*, b.title as brief_title, b.tier 
        FROM applications a 
        JOIN briefs b ON a.brief_id = b.id 
        WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (briefId) {
        paramCount++;
        query += ` AND a.brief_id = $${paramCount}`;
        params.push(briefId);
    }
    
    if (status) {
        paramCount++;
        query += ` AND a.status = $${paramCount}`;
        params.push(status);
    }
    
    if (tier) {
        paramCount++;
        query += ` AND b.tier = $${paramCount}`;
        params.push(tier);
    }

    query += ' ORDER BY a.submitted_at DESC';

    try {
        const result = await pool.query(query, params);
        res.json({ applications: result.rows });
    } catch (err) {
        console.error('Error fetching applications:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});

// Update application status
app.put('/api/admin/application/:id', authenticateAdmin, async (req, res) => {
    const { status, adminFeedback } = req.body;
    
    try {
        await pool.query(
            'UPDATE applications SET status = $1, admin_feedback = $2 WHERE id = $3',
            [status, adminFeedback, req.params.id]
        );
        res.json({ success: true });
    } catch (err) {
        console.error('Error updating application:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});

// Bulk update applications
app.post('/api/admin/applications/bulk-update', authenticateAdmin, async (req, res) => {
    const { applicationIds, status } = req.body;
    
    if (!applicationIds || applicationIds.length === 0) {
        return res.status(400).json({ error: 'No applications selected' });
    }

    const placeholders = applicationIds.map((_, i) => `$${i + 2}`).join(',');
    
    try {
        const result = await pool.query(
            `UPDATE applications SET status = $1 WHERE id IN (${placeholders})`,
            [status, ...applicationIds]
        );
        res.json({ success: true, updatedCount: result.rowCount });
    } catch (err) {
        console.error('Error bulk updating applications:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});

// ==================== USER ENDPOINTS ====================

// User login (check email across all applications)
app.post('/api/user/login', async (req, res) => {
    const { email } = req.body;
    
    try {
        const result = await pool.query(
            'SELECT * FROM applications WHERE email = $1',
            [email]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No applications found with this email' });
        }
        
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, email });
    } catch (err) {
        console.error('User login error:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});

// Get user's applications
app.get('/api/user/applications', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const email = decoded.email;
        
        const result = await pool.query(
            `SELECT a.*, b.title as brief_title, b.location, b.tier 
             FROM applications a 
             JOIN briefs b ON a.brief_id = b.id 
             WHERE a.email = $1 
             ORDER BY a.submitted_at DESC`,
            [email]
        );
        
        res.json({ applications: result.rows });
    } catch (error) {
        console.error('Error fetching user applications:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
});

// ==================== WEBHOOK ENDPOINT ====================

// Tally webhook handler
app.post('/api/webhook/tally', async (req, res) => {
    const { eventType, data } = req.body;
    
    if (eventType === 'SUBMISSION_CREATED') {
        const { formId, submissionId } = data;
        
        try {
            // Find the brief connected to this form
            const briefResult = await pool.query(
                'SELECT id FROM briefs WHERE tally_form_id = $1',
                [formId]
            );
            
            if (briefResult.rows.length === 0) {
                return res.status(200).json({ received: true });
            }
            
            const briefId = briefResult.rows[0].id;
            
            // Extract fields from submission
            const fields = data.fields || {};
            const email = fields.email || fields.Email || '';
            const instagram = fields.instagram || fields.Instagram || '';
            const portfolio = fields.portfolio || fields.Portfolio || '';
            const proposal = fields.proposal || fields['Content Proposal'] || '';
            
            // Insert application
            await pool.query(
                `INSERT INTO applications 
                 (brief_id, tally_submission_id, email, instagram, portfolio, content_proposal, submitted_at, raw_tally_data) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                 ON CONFLICT (tally_submission_id) DO NOTHING`,
                [
                    briefId,
                    submissionId,
                    email,
                    instagram,
                    portfolio,
                    proposal,
                    data.createdAt || new Date(),
                    JSON.stringify(data)
                ]
            );
        } catch (err) {
            console.error('Webhook processing error:', err);
        }
    }
    
    res.status(200).json({ received: true });
});

// ==================== STATS ENDPOINT ====================

// Dashboard statistics
app.get('/api/admin/stats', authenticateAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                COUNT(DISTINCT b.id)::int as total_briefs,
                COUNT(DISTINCT CASE WHEN b.status = 'live' THEN b.id END)::int as live_briefs,
                COUNT(DISTINCT CASE WHEN b.status = 'expired' THEN b.id END)::int as expired_briefs,
                COUNT(a.id)::int as total_applications,
                COUNT(CASE WHEN a.status = 'submitted' THEN 1 END)::int as pending_applications,
                COUNT(CASE WHEN a.status = 'accepted' THEN 1 END)::int as accepted_applications,
                COUNT(CASE WHEN a.status = 'unsuccessful' THEN 1 END)::int as unsuccessful_applications
            FROM briefs b
            LEFT JOIN applications a ON b.id = a.brief_id
        `);
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching stats:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});

// Health check endpoint for Railway
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
    console.log(`[404] ${req.method} ${req.path} not found`);
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Admin login: admin / admin123`);
    console.log(`Database: ${process.env.DATABASE_URL ? 'PostgreSQL connected' : 'No DATABASE_URL found'}`);
    console.log(`Test endpoint: /api/test`);
    console.log('CORS: Debug mode - All origins allowed with credentials');
});

// Graceful shutdown
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

async function shutdown() {
    console.log('Shutting down gracefully...');
    await pool.end();
    console.log('Database pool closed.');
    process.exit(0);
}
