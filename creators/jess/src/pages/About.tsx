import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Lightbulb, Target, Award } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Authenticity",
      description: "Creating genuine content that truly resonates with audiences.",
      color: "text-secondary",
    },
    {
      icon: Lightbulb,
      title: "Creativity",
      description: "Always exploring new ways to tell stories and engage viewers.",
      color: "text-primary",
    },
    {
      icon: Target,
      title: "Strategy",
      description: "Data-driven approach to content that delivers real results.",
      color: "text-blue",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to delivering high-quality work that exceeds expectations.",
      color: "text-accent",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-16">
            <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom duration-1000">
              <h1 className="text-6xl md:text-7xl font-heading font-bold text-foreground">
                ABOUT ME
              </h1>
              <p className="text-xl text-muted-foreground">
                Freelance Marketing Manager & Content Creator
              </p>
            </div>

            <div className="prose prose-lg max-w-none space-y-6">
              <p className="text-lg leading-relaxed text-foreground">
                Hey! I'm Jess, a freelance marketing manager and content creator based in the UK. 
                I've been creating my own social content for a few years now, and I absolutely love 
                bringing brands to life through authentic storytelling and engaging content.
              </p>

              <p className="text-lg leading-relaxed text-foreground">
                My journey into content creation started while working in marketing, where I discovered 
                my passion for filming, editing, and creating content that genuinely connects with people. 
                I've had the privilege of working with some amazing brands including Premier Inn, Monzo, 
                EasyJet, and Colour Wow.
              </p>

              <p className="text-lg leading-relaxed text-foreground">
                I'm particularly passionate about self-development brands and love working with companies 
                that share positive energy and good vibes. Whether it's creating UGC content, speaking at 
                events, or developing strategic marketing campaigns, I bring creativity, authenticity, and 
                a data-driven approach to every project.
              </p>

              <p className="text-lg leading-relaxed text-foreground">
                When I'm not creating content, you'll find me exploring new travel destinations, diving 
                into the latest self-development books, or experimenting with new content formats and editing styles.
              </p>
            </div>

            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground text-center">
                MY VALUES
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <Card 
                    key={value.title}
                    className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <CardContent className="p-8 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <value.icon className={`w-7 h-7 ${value.color}`} />
                        </div>
                        <h3 className="text-2xl font-heading font-bold text-foreground">
                          {value.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
