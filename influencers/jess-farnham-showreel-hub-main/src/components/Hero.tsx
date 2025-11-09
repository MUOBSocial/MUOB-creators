import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { Sparkles, PlayCircle } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-hero opacity-20 animate-pulse"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
          <div className="space-y-4">
            <h1 className="text-7xl md:text-9xl font-heading font-bold text-secondary leading-none">
              JESS FARNHAM
            </h1>
            <p className="text-2xl md:text-3xl font-medium text-foreground">
              Content Creator • Marketing Specialist • Speaker
            </p>
          </div>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Creating authentic, engaging content that brings brands to life. 
            From UGC to public speaking, I help brands connect with their audience through genuine storytelling.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              asChild
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold text-lg px-8 py-6"
            >
              <NavLink to="/contact">
                <Sparkles className="w-5 h-5 mr-2" />
                Let's Work Together
              </NavLink>
            </Button>
            
            <Button 
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-semibold text-lg px-8 py-6"
            >
              <a href="#showreel">
                <PlayCircle className="w-5 h-5 mr-2" />
                View Showreel
              </a>
            </Button>
          </div>

          <div className="flex gap-6 justify-center items-center pt-8 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
              <span className="text-sm font-medium text-foreground">Available for Collaborations</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-secondary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-secondary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
