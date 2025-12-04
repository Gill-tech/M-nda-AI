import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone, MessageSquare, Radio, Sprout } from "lucide-react";

const accessMethods = [
  { icon: Smartphone, label: "Web App", description: "Full dashboard" },
  { icon: MessageSquare, label: "WhatsApp", description: "Chat bot" },
  { icon: Radio, label: "USSD", description: "Low network" },
];

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary to-primary/80 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-8">
          <Sprout className="w-8 h-8 text-primary-foreground" />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-6">
          Ready to Transform Your Farm?
        </h2>
        <p className="text-lg sm:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
          Join thousands of farmers already using Múnda AI to predict tomorrow, 
          protect their harvest, and access fair finance.
        </p>

        {/* Access Methods */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {accessMethods.map((method, index) => (
            <div key={index} className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20">
              <method.icon className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-primary-foreground">{method.label}</span>
              <span className="text-xs text-primary-foreground/60">• {method.description}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup">
            <Button variant="gold" size="xl">
              Register Your Farm
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/market">
            <Button variant="hero-outline" size="xl" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20">
              Explore Markets
            </Button>
          </Link>
        </div>

        <p className="mt-8 text-sm text-primary-foreground/60">
          No credit card required • Works on any device • Local language support
        </p>
      </div>
    </section>
  );
}