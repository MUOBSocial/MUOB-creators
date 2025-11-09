import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { Sparkles, PlayCircle } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Fullscreen Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <iframe 
          src="https://player.vimeo.com/video/1088385670?h=161bd805a6&autoplay=1&muted=1&loop=1&autopause=0&playsinline=1&controls=0&background=1"
          className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ width: '100vw', height: '56.25vw', minHeight: '100vh', minWidth: '177.78vh' }}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        ></iframe>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-foreground/40"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10 pt-20">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-heading font-bold text-primary leading-none drop-shadow-2xl">
              JESS FARNHAM
            </h1>
            <p className="text-lg sm:text-2xl md:text-3xl font-medium text-background drop-shadow-md px-4">
              Content Creator • Marketing Specialist • Speaker
            </p>
          </div>

          <p className="text-base sm:text-lg md:text-xl text-background/90 max-w-2xl mx-auto drop-shadow-md px-4">
            Creating authentic, engaging content that brings brands to life. 
            From UGC to public speaking, I help brands connect with their audience through genuine storytelling.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4 px-4">
            <Button 
              asChild
              size="lg"
              className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-background font-semibold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 shadow-lg"
            >
              <NavLink to="/contact">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Let's Work Together
              </NavLink>
            </Button>
            
            <Button 
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-2 border-primary bg-background/10 backdrop-blur-sm text-primary hover:bg-primary hover:text-foreground font-semibold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6"
            >
              <a href="#showreel">
                <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                View Showreel
              </a>
            </Button>
          </div>

          <div className="flex gap-4 sm:gap-6 justify-center items-center pt-6 sm:pt-8 flex-wrap px-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-primary animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium text-background drop-shadow-md">Available for Collaborations</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 sm:bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
        <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-background rounded-full flex justify-center">
          <div className="w-1 h-2 sm:h-3 bg-background rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
