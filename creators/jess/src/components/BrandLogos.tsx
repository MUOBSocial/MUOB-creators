import { Card } from "@/components/ui/card";

const brands = [
  { name: "Premier Inn", logo: "/logos/premier-inn.svg" },
  { name: "Monzo", logo: "/logos/monzo.png" },
  { name: "EasyJet", logo: "/logos/easyjet.svg" },
  { name: "Colour Wow", logo: "/logos/colour-wow.png" },
  { name: "Headspace", logo: "/logos/headspace-new.jpeg" },
  { name: "Dash Water", logo: "/logos/dash-water-new.png" },
];

const BrandLogos = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-primary mb-3 sm:mb-4">
            TRUSTED BY BRANDS
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground px-4">
            Collaborating with amazing companies to create impactful content
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
          {brands.map((brand, index) => (
            <div
              key={brand.name}
              className="flex items-center justify-center p-4 sm:p-6 md:p-8 bg-card rounded-lg hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-lg"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="w-full flex flex-col items-center justify-center gap-2 sm:gap-3">
                <div className="h-12 sm:h-14 md:h-16 w-full flex items-center justify-center">
                  <img 
                    src={brand.logo} 
                    alt={brand.name}
                    className="max-w-full max-h-full object-contain transition-all duration-300"
                  />
                </div>
                <p className="text-xs sm:text-sm font-body text-muted-foreground text-center">{brand.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandLogos;
