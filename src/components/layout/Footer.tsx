import { Link, useNavigate, useLocation } from "react-router-dom";
import { Sprout, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  Platform: [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Market Insights", href: "/market" },
    { name: "Agrifinance", href: "/finance" },
    { name: "Farm Registration", href: "/register-farm" },
  ],
  Resources: [
    { name: "Login", href: "/login" },
    { name: "Sign Up", href: "/signup" },
  ],
  Company: [
    { name: "About Us", href: "/#about" },
  ],
};

export function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    if (href === "/#about") {
      e.preventDefault();
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Sprout className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-semibold">
                Múnda<span className="text-secondary">AI</span>
              </span>
            </Link>
            <p className="text-primary-foreground/70 mb-6 max-w-sm">
              Intelligence for Farmers. Clarity for Markets. Confidence for the Future. 
              Bringing climate intelligence, market forecasting, and inclusive finance to smallholder farmers.
            </p>
            <div className="flex flex-col gap-3 text-sm text-primary-foreground/70">
              <a href="mailto:hello@munda.ai" className="flex items-center gap-2 hover:text-secondary transition-colors">
                <Mail className="w-4 h-4" />
                hello@munda.ai
              </a>
              <a href="tel:+254700000000" className="flex items-center gap-2 hover:text-secondary transition-colors">
                <Phone className="w-4 h-4" />
                +254 700 000 000
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Nairobi, Kenya
              </span>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      onClick={(e) => handleLinkClick(link.href, e)}
                      className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} Múnda AI. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <span className="text-primary-foreground/60">
              Privacy Policy
            </span>
            <span className="text-primary-foreground/60">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}