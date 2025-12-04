import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Grace Wanjiku",
    role: "Maize Farmer, Kenya",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=face",
    quote: "AgriSmart Hub warned me about the drought 3 weeks early. I adjusted my planting and saved 80% of my harvest. The insurance payout came automatically!",
    rating: 5,
  },
  {
    name: "Emmanuel Osei",
    role: "Rice Farmer, Ghana",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    quote: "The market insights feature helped me find buyers offering 15% more for my rice. The food waste tracker also reduced my post-harvest losses significantly.",
    rating: 5,
  },
  {
    name: "Amina Diallo",
    role: "Cooperative Leader, Senegal",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    quote: "Our cooperative of 200 farmers now uses AgriSmart Hub. The loan application process is simple and the climate risk maps help us plan together.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Success Stories
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-display font-bold text-foreground">
            Farmers Thriving with{" "}
            <span className="text-secondary">AgriSmart Hub</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Hear from farmers across Africa who have transformed their operations 
            with our AI-powered platform.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="p-8 rounded-2xl bg-card border border-border shadow-soft card-hover"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground/90 mb-8 leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
