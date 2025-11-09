import { Card, CardContent } from "@/components/ui/card";
import { Video, MessageSquare, Mic, Sparkles } from "lucide-react";

const services = [
  {
    icon: Video,
    title: "UGC Content",
    description: "Authentic user-generated content that resonates with your audience and drives engagement.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: MessageSquare,
    title: "Content Creation",
    description: "From concept to execution, creating scroll-stopping content for social media and beyond.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Mic,
    title: "Speaking",
    description: "Engaging public speaking on marketing, content creation, and personal development topics.",
    color: "text-blue",
    bgColor: "bg-blue/10",
  },
  {
    icon: Sparkles,
    title: "Brand Partnerships",
    description: "Strategic collaborations that align with your brand values and connect with the right audience.",
    color: "text-green",
    bgColor: "bg-green/10",
  },
];

const Services = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-heading font-bold text-foreground mb-4">
            WHAT I DO
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Bringing creativity, authenticity, and strategy to every project
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <Card 
              key={service.title}
              className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-border overflow-hidden"
              style={{
                animationDelay: `${index * 150}ms`,
              }}
            >
              <CardContent className="p-8 space-y-4">
                <div className={`w-16 h-16 ${service.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className={`w-8 h-8 ${service.color}`} />
                </div>
                <h3 className="text-2xl font-heading font-bold text-foreground">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
