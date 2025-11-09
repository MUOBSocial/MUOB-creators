import { Instagram, Linkedin, Mail } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-3xl font-heading font-bold mb-4">JESS FARNHAM</h3>
            <p className="text-background/80">
              Content creator and marketing specialist bringing brands to life through authentic storytelling.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-heading font-bold mb-4">QUICK LINKS</h4>
            <div className="space-y-2">
              <NavLink to="/" className="block text-background/80 hover:text-primary transition-colors">
                Home
              </NavLink>
              <NavLink to="/about" className="block text-background/80 hover:text-primary transition-colors">
                About
              </NavLink>
              <NavLink to="/contact" className="block text-background/80 hover:text-primary transition-colors">
                Contact
              </NavLink>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-heading font-bold mb-4">CONNECT</h4>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/jess.farnham/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground hover:bg-secondary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/jessica-farnham" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground hover:bg-secondary transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <NavLink 
                to="/contact"
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground hover:bg-secondary transition-colors"
              >
                <Mail className="w-5 h-5" />
              </NavLink>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 text-center text-background/60">
          <p>&copy; {new Date().getFullYear()} Jess Farnham. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
