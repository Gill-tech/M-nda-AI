import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MundaAI } from "@/components/MundaAI";
import {
  Sprout,
  LayoutDashboard,
  CloudSun,
  Store,
  Warehouse,
  CreditCard,
  Map,
  FlaskConical,
  TrendingUp,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Menu,
  X,
  Calendar,
  Sun,
  Moon,
} from "lucide-react";

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Soil Testing", href: "/soil-testing", icon: FlaskConical },
  { name: "Land Mapping", href: "/land-mapping", icon: Map },
  { name: "Crop Calendar", href: "/crop-calendar", icon: Calendar },
  { name: "Market Intelligence", href: "/market", icon: Store },
  { name: "Climate Alerts", href: "/climate-alerts", icon: CloudSun },
  { name: "Food Storage", href: "/food-storage", icon: Warehouse },
  { name: "Finance", href: "/finance", icon: CreditCard },
  { name: "Credit Score", href: "/credit-score", icon: TrendingUp },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-xl font-semibold text-sidebar-foreground">
            Múnda<span className="text-secondary">AI</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - Dark themed */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
          "hidden lg:flex",
          collapsed ? "lg:w-20" : "lg:w-64",
          mobileOpen && "flex w-64 shadow-2xl"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow flex-shrink-0">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <span className="font-display text-xl font-semibold text-sidebar-foreground">
                Múnda<span className="text-secondary">AI</span>
              </span>
            )}
          </Link>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground/70 hover:text-sidebar-foreground"
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground/70 hover:text-sidebar-foreground"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground/70 hover:text-sidebar-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                      : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span>{link.name}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Section */}
        <div className="border-t border-sidebar-border p-3">
          {user ? (
            <div className={cn("space-y-2", collapsed && "flex flex-col items-center")}>
              <div className={cn("flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent", collapsed && "justify-center")}>
                <Avatar className="h-9 w-9 flex-shrink-0">
                  <AvatarFallback className="bg-secondary text-white text-sm font-medium">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      {profile?.full_name || "User"}
                    </p>
                    <p className="text-xs text-sidebar-foreground/60 truncate">{user.email}</p>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className={cn(
                  "w-full text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/20",
                  collapsed && "px-2"
                )}
              >
                <LogOut className="w-4 h-4" />
                {!collapsed && <span className="ml-2">Logout</span>}
              </Button>
            </div>
          ) : (
            <div className={cn("space-y-2", collapsed && "flex flex-col items-center")}>
              <Link to="/login" className="w-full">
                <Button variant="outline" size="sm" className={cn("w-full border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent", collapsed && "px-2")}>
                  <User className="w-4 h-4" />
                  {!collapsed && <span className="ml-2">Sign In</span>}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main 
        className={cn(
          "min-h-screen transition-all duration-300 bg-background",
          "pt-16 lg:pt-0",
          collapsed ? "lg:ml-20" : "lg:ml-64"
        )}
      >
        {children}
      </main>

      <MundaAI />
    </div>
  );
}
