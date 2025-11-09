import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import BrandLogos from "@/components/BrandLogos";
import Services from "@/components/Services";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <BrandLogos />
      <Services />
      <Footer />
    </div>
  );
};

export default Index;
