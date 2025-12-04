import { Target, Users, Globe, Award, Heart, Eye, Shield, Sparkles } from "lucide-react";
import farmerCrops from "@/assets/farmer-crops.jpg";

const stats = [
  { label: "Farmers Served", value: "10,000+", icon: Users },
  { label: "Counties Covered", value: "47", icon: Globe },
  { label: "Finance Disbursed", value: "KES 50M+", icon: Award },
  { label: "Prediction Accuracy", value: "94%", icon: Target },
];

const userTypes = [
  {
    title: "Smallholder Farmers",
    description: "Rain-fed farmers growing maize, beans, potatoes, vegetables, and horticultural crops in counties like Nakuru, Nyandarua, Narok, and Kajiado.",
  },
  {
    title: "Cooperatives & Producer Groups",
    description: "Use risk maps and yield forecasts to negotiate better insurance and coordinate collective sales across regions.",
  },
  {
    title: "Extension Officers",
    description: "Combine field insights with satellite overlays to give accurate, location-specific advice to farming communities.",
  },
  {
    title: "Financial & Insurance Partners",
    description: "Use real-time credit scoring and automated triggers to derisk portfolios and serve more farmers.",
  },
];

const principles = [
  { icon: Heart, title: "Ethical Data", description: "Open datasets with clear consent" },
  { icon: Eye, title: "Explainable AI", description: "Human-readable insights" },
  { icon: Shield, title: "Equity First", description: "No community excluded" },
  { icon: Sparkles, title: "Fair Outcomes", description: "Bias checks across regions" },
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Image */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                About Múnda AI
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
                Why This <span className="text-primary">Matters</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Farmers face unpredictable rainfall, extreme droughts, sudden floods, and unstable markets. 
                Most still make decisions without early warnings or price forecasts. Múnda AI changes this 
                by giving farmers the same level of intelligence used by large agribusinesses.
              </p>
            </div>
            <div className="relative h-72 lg:h-96 rounded-2xl overflow-hidden">
              <img 
                src={farmerCrops} 
                alt="Kenyan farmer with crops" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-foreground font-medium text-lg drop-shadow-lg">
                  Empowering smallholder farmers with climate intelligence
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-card border border-border text-center card-hover"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-display font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Who We Serve */}
        <div className="mb-16">
          <h3 className="text-2xl font-display font-bold text-foreground text-center mb-8">
            Who Múnda AI Serves
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userTypes.map((user, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-card border border-border card-hover"
              >
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  {user.title}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {user.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Ethical Principles */}
        <div className="mb-16 p-8 rounded-2xl bg-card border border-border">
          <h3 className="text-xl font-semibold text-foreground text-center mb-8">
            Ethical and Fair by Design
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {principles.map((principle, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-3">
                  <principle.icon className="w-6 h-6 text-secondary" />
                </div>
                <div className="font-medium text-foreground text-sm mb-1">{principle.title}</div>
                <div className="text-xs text-muted-foreground">{principle.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Vision */}
        <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-border text-center">
          <h3 className="text-xl font-semibold text-foreground mb-3">
            Our Vision
          </h3>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg italic">
            "A continent where a farmer can predict tomorrow, protect their harvest, 
            negotiate better prices, and access fair finance without leaving their shamba."
          </p>
          <p className="mt-6 text-sm text-primary font-medium">
            Múnda AI turns intelligence into impact and puts that power directly in the farmer's hands.
          </p>
        </div>

        {/* Name Origin */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Múnda</span> comes from the Akamba word <em>shamba</em>, meaning land. 
            The land is the farmer's foundation, and Múnda AI is built to protect it.
          </p>
        </div>
      </div>
    </section>
  );
}