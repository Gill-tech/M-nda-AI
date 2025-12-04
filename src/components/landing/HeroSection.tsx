import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Cloud, TrendingUp, Shield, Cpu, MapPin, CreditCard } from "lucide-react";
import heroImage from "@/assets/hero-farm.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Kenyan agricultural landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/80 to-foreground/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-sm font-medium text-primary-foreground">
              Climate Smart Agriculture Kit
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-primary-foreground leading-tight mb-6 animate-slide-up">
            Intelligence for Farmers.{" "}
            <span className="text-secondary">Clarity for Markets.</span>{" "}
            <span className="block mt-2">Confidence for the Future.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-primary-foreground/80 mb-10 max-w-2xl animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Múnda AI brings climate intelligence, market forecasting, and inclusive finance 
            into one practical tool that any smallholder farmer can use.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link to="/signup">
              <Button variant="gold" size="xl" className="w-full sm:w-auto">
                Register Your Farm
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/market">
              <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                Explore Markets
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div>
              <div className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground mb-1">
                47
              </div>
              <div className="text-sm text-primary-foreground/60">Counties Covered</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-display font-bold text-secondary mb-1">
                94%
              </div>
              <div className="text-sm text-primary-foreground/60">Prediction Accuracy</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground mb-1">
                24hr
              </div>
              <div className="text-sm text-primary-foreground/60">Loan Approval</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Cards (Desktop) */}
      <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 z-10 space-y-4">
        <div className="glass-card p-4 rounded-xl animate-float" style={{ animationDelay: "0s" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Cloud className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">Soil Moisture</div>
              <div className="text-xs text-muted-foreground">Optimal: 42%</div>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 rounded-xl animate-float" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">Tomato Price</div>
              <div className="text-xs text-muted-foreground">Nakuru: +18% ↑</div>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 rounded-xl animate-float" style={{ animationDelay: "1s" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">Credit Score</div>
              <div className="text-xs text-muted-foreground">Dynamic: 720</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}