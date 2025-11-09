import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Instagram, Linkedin, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for your message! I'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-6 mb-16 animate-in fade-in slide-in-from-bottom duration-1000">
              <h1 className="text-6xl md:text-7xl font-heading font-bold text-foreground">
                LET'S CONNECT
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Have a project in mind? Want to collaborate? I'd love to hear from you!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-3xl font-heading">Send a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2 text-foreground">
                        Your Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Jess Farnham"
                        className="border-2"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2 text-foreground">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="hello@jessfarnham.com"
                        className="border-2"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2 text-foreground">
                        Your Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Tell me about your project..."
                        rows={6}
                        className="border-2"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg"
                      className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-heading font-bold mb-2 text-foreground">Email</h3>
                        <p className="text-muted-foreground">
                          Drop me an email and I'll get back to you as soon as possible.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Instagram className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-xl font-heading font-bold mb-2 text-foreground">Instagram</h3>
                        <p className="text-muted-foreground mb-2">
                          Follow me for behind-the-scenes content and updates.
                        </p>
                        <a 
                          href="https://www.instagram.com/jess.farnham/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-accent hover:text-accent/80 font-medium"
                        >
                          @jess.farnham
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Linkedin className="w-6 h-6 text-blue" />
                      </div>
                      <div>
                        <h3 className="text-xl font-heading font-bold mb-2 text-foreground">LinkedIn</h3>
                        <p className="text-muted-foreground mb-2">
                          Let's connect professionally on LinkedIn.
                        </p>
                        <a 
                          href="https://www.linkedin.com/in/jessica-farnham" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue hover:text-blue/80 font-medium"
                        >
                          Jessica Farnham
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
