import { 
  Cpu, 
  Shield, 
  TrendingUp, 
  CreditCard, 
  MessageCircle, 
  Map,
  Thermometer,
  CloudRain,
  BarChart3
} from "lucide-react";
import soilImage from "@/assets/soil-testing.jpg";

const features = [
  {
    icon: Cpu,
    title: "Climate Smart Agric Kit",
    description: "Compact sensors streaming soil moisture, temperature, rainfall trends, drought and flood indicators in real-time from your farm.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Shield,
    title: "Parametric Insurance",
    description: "Automatic payouts when rainfall or vegetation indices cross risk thresholds. No field inspections, no manual assessments.",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: TrendingUp,
    title: "Market & Yield Intelligence",
    description: "Predict future crop prices in specific counties, buyer demand, oversupply pockets, and expected yields based on your acreage.",
    color: "bg-success/10 text-success",
  },
  {
    icon: CreditCard,
    title: "Dynamic Credit Scoring",
    description: "Build a live credit score from climate resilience and predicted yield. Speed up loan approvals and create your financial identity.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: MessageCircle,
    title: "Voice Bots & USSD",
    description: "Access insights through local-language voice bots, SMS, WhatsApp, or USSD for low-network areas. Designed for all farmers.",
    color: "bg-warning/10 text-warning",
  },
  {
    icon: Map,
    title: "Geographic Mapping",
    description: "Web UI with interactive maps showing markets, roads, soil patterns, and finance institutions across all 47 Kenyan counties.",
    color: "bg-primary/10 text-primary",
  },
];

const kitFeatures = [
  { icon: Thermometer, label: "Soil Temperature" },
  { icon: CloudRain, label: "Rainfall Trends" },
  { icon: BarChart3, label: "Weather Anomalies" },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-background crop-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Platform Features
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-display font-bold text-foreground">
            What <span className="text-primary">Múnda AI</span> Does
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From farm sensors to market predictions to fair finance—everything you need 
            to transform risk into clarity and data into higher income.
          </p>
        </div>

        {/* Kit Highlight */}
        <div className="mb-16 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-border overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-0">
            <div className="flex-1 p-8">
              <h3 className="text-2xl font-display font-bold text-foreground mb-4">
                Start with the Climate Smart Agric Kit
              </h3>
              <p className="text-muted-foreground mb-6">
                Each farmer receives a kit that captures real-time soil conditions, weather signals, 
                and environmental stress. The system builds a complete, verifiable risk profile of your farm.
              </p>
              <div className="flex flex-wrap gap-4">
                {kitFeatures.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
                    <item.icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full md:w-72 h-64 md:h-72 relative">
              <img 
                src={soilImage} 
                alt="Soil testing kit" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-background/80 hidden md:block" />
              <div className="absolute inset-0 flex items-center justify-center bg-primary/20 backdrop-blur-sm">
                <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center animate-pulse-slow">
                  <Cpu className="w-10 h-10 text-primary-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-8 rounded-2xl bg-card border border-border card-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}