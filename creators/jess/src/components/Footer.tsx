import { Instagram, Linkedin, Mail } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="text-center sm:text-left">
            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-secondary mb-3 sm:mb-4">
              JESS FARNHAM
            </h3>
            <p className="text-sm text-muted-foreground">
              Content Creator • Marketing Specialist • Speaker
            </p>
          </div>

          <div className="text-center sm:text-left">
            <h4 className="font-heading text-lg sm:text-xl text-primary mb-3 sm:mb-4">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <NavLink to="/" className="text-sm text-foreground hover:text-secondary transition-colors">
                Home
              </NavLink>
              <NavLink to="/about" className="text-sm text-foreground hover:text-secondary transition-colors">
                About
              </NavLink>
              <NavLink to="/contact" className="text-sm text-foreground hover:text-secondary transition-colors">
                Contact
              </NavLink>
            </nav>
          </div>

          <div className="text-center sm:text-left">
            <h4 className="font-heading text-lg sm:text-xl text-primary mb-3 sm:mb-4">Connect</h4>
            <div className="flex gap-4 justify-center sm:justify-start">
              <a 
                href="https://www.instagram.com/jess.farnham/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground hover:text-secondary transition-colors"
              >
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a 
                href="https://www.linkedin.com/in/jessica-farnham" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground hover:text-secondary transition-colors"
              >
                <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a 
                href="mailto:contact@jessfarnham.com"
                className="text-foreground hover:text-secondary transition-colors"
              >
                <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
            </div>
          </div>

          <div className="text-center sm:text-left">
            <h4 className="font-heading text-lg sm:text-xl text-primary mb-3 sm:mb-4">Get in Touch</h4>
            <p className="text-sm text-muted-foreground">
              Available for collaborations and speaking engagements.
            </p>
          </div>
        </div>

        <div className="border-t border-border mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            © {new Date().getFullYear()} Jess Farnham. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
