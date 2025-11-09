import { Card } from "@/components/ui/card";

const brands = [
  { name: "Premier Inn", color: "bg-purple" },
  { name: "Monzo", color: "bg-secondary" },
  { name: "EasyJet", color: "bg-orange" },
  { name: "Colour Wow", color: "bg-accent" },
  { name: "Headspace", color: "bg-blue" },
  { name: "Dash Water", color: "bg-green" },
];

const BrandLogos = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-heading font-bold text-foreground mb-4">
            TRUSTED BY BRANDS
          </h2>
          <p className="text-xl text-muted-foreground">
            Collaborating with amazing companies to create impactful content
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
          {brands.map((brand, index) => (
            <Card 
              key={brand.name}
              className="p-6 flex items-center justify-center hover:scale-105 transition-transform duration-300 cursor-pointer"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="text-center">
                <div className={`w-16 h-16 ${brand.color} rounded-full mx-auto mb-3 flex items-center justify-center text-white font-heading text-2xl`}>
                  {brand.name.charAt(0)}
                </div>
                <p className="font-semibold text-sm text-foreground">{brand.name}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandLogos;
