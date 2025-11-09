import { useState } from "react";
import { NavLink } from "@/components/NavLink";
import { Instagram, Linkedin, Mail, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navigation = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="text-2xl sm:text-3xl font-heading font-bold text-secondary hover:text-primary transition-colors">
            JESS FARNHAM
          </NavLink>
          
          {/* Desktop Navigation */}
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

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
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
              className="bg-secondary hover:bg-secondary/90 text-background"
            >
              <NavLink to="/contact">
                <Mail className="w-4 h-4 mr-2" />
                Get in Touch
              </NavLink>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-8">
                <NavLink 
                  to="/" 
                  onClick={() => setOpen(false)}
                  className="text-2xl font-heading font-bold text-foreground hover:text-secondary transition-colors"
                  activeClassName="text-secondary"
                >
                  Home
                </NavLink>
                <NavLink 
                  to="/about" 
                  onClick={() => setOpen(false)}
                  className="text-2xl font-heading font-bold text-foreground hover:text-secondary transition-colors"
                  activeClassName="text-secondary"
                >
                  About
                </NavLink>
                <NavLink 
                  to="/contact" 
                  onClick={() => setOpen(false)}
                  className="text-2xl font-heading font-bold text-foreground hover:text-secondary transition-colors"
                  activeClassName="text-secondary"
                >
                  Contact
                </NavLink>

                <div className="border-t border-border pt-6 mt-4">
                  <div className="flex items-center gap-4 mb-6">
                    <a 
                      href="https://www.instagram.com/jess.farnham/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-foreground hover:text-secondary transition-colors"
                    >
                      <Instagram className="w-6 h-6" />
                    </a>
                    <a 
                      href="https://www.linkedin.com/in/jessica-farnham" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-foreground hover:text-secondary transition-colors"
                    >
                      <Linkedin className="w-6 h-6" />
                    </a>
                  </div>
                  <Button 
                    asChild
                    className="w-full bg-secondary hover:bg-secondary/90 text-background"
                    onClick={() => setOpen(false)}
                  >
                    <NavLink to="/contact">
                      <Mail className="w-4 h-4 mr-2" />
                      Get in Touch
                    </NavLink>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
