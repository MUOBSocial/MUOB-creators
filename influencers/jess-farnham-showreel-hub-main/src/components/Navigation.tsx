import { NavLink } from "@/components/NavLink";
import { Instagram, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="text-3xl font-heading font-bold text-secondary hover:text-primary transition-colors">
            JESS FARNHAM
          </NavLink>
          
          <div className="hidden md:flex items-center gap-8">
            <NavLink 
              to="/" 
              className="text-lg font-medium text-foreground hover:text-secondary transition-colors"
              activeClassName="text-secondary"
            >
              Home
            </NavLink>
            <NavLink 
              to="/about" 
              className="text-lg font-medium text-foreground hover:text-secondary transition-colors"
              activeClassName="text-secondary"
            >
              About
            </NavLink>
            <NavLink 
              to="/contact" 
              className="text-lg font-medium text-foreground hover:text-secondary transition-colors"
              activeClassName="text-secondary"
            >
              Contact
            </NavLink>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="https://www.instagram.com/jess.farnham/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground hover:text-secondary transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a 
              href="https://www.linkedin.com/in/jessica-farnham" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground hover:text-secondary transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <Button 
              asChild
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              <NavLink to="/contact">
                <Mail className="w-4 h-4 mr-2" />
                Get in Touch
              </NavLink>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
