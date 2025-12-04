import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { WeatherAnimation } from "@/components/WeatherAnimation";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import aerialFarm from "@/assets/aerial-farm.jpg";
import farmerInspecting from "@/assets/farmer-inspecting.jpg";
import { 
  TrendingUp, 
  MapPin,
  Bell,
  CreditCard,
  Sun,
  Droplets,
  Wind,
  Thermometer,
  Leaf,
  Map,
  BookOpen,
  FlaskConical,
  Calendar,
  Sprout,
  Eye,
  Loader2,
  CloudRain,
  CloudSun
} from "lucide-react";

const Dashboard = () => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [hasFarm, setHasFarm] = useState(false);
  const [farmData, setFarmData] = useState<any>(null);
  const [weather, setWeather] = useState({
    temperature: 24,
    humidity: 65,
    windSpeed: 12,
    condition: "Partly Cloudy",
    forecast: "Light rain expected tomorrow"
  });
  const [soilReadings, setSoilReadings] = useState({
    nitrogen: 45,
    phosphorus: 32,
    potassium: 28,
    moisture: 42,
    temperature: 22,
    lastUpdated: new Date().toISOString()
  });
  const [recommendedCrops, setRecommendedCrops] = useState([
    { name: "Maize", suitability: 92, reason: "Optimal soil pH and moisture" },
    { name: "Beans", suitability: 88, reason: "Good nitrogen levels" },
    { name: "Tomatoes", suitability: 85, reason: "Favorable temperature range" }
  ]);
  const [recommendedAnimals, setRecommendedAnimals] = useState([
    { name: "Dairy Cattle", suitability: 90, reason: "Adequate pasture and water" },
    { name: "Poultry", suitability: 95, reason: "Low initial investment" }
  ]);

  useEffect(() => {
    const checkFarm = async () => {
      if (user) {
        const { data } = await supabase
          .from('farms')
          .select('*')
          .eq('user_id', user.id)
          .limit(1);
        if (data && data.length > 0) {
          setHasFarm(true);
          setFarmData(data[0]);
        }
      }
    };
    checkFarm();
  }, [user]);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  const getFirstName = () => {
    if (profile?.full_name) {
      return profile.full_name.split(" ")[0];
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "Farmer";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const quickActions = [
    { icon: Map, label: "View Land Map", href: "/land-mapping", color: "bg-primary/10 text-primary" },
    { icon: TrendingUp, label: "Market Prices", href: "/market", color: "bg-success/10 text-success" },
    { icon: BookOpen, label: "Farming Guide", href: "/soil-testing", color: "bg-secondary/10 text-secondary" },
    { icon: FlaskConical, label: "Soil Analysis", href: "/soil-testing", color: "bg-accent/10 text-accent" },
    { icon: Calendar, label: "Crop Calendar", href: "/crop-calendar", color: "bg-warning/10 text-warning" },
    { icon: CreditCard, label: "Credit Score", href: "/credit-score", color: "bg-primary/10 text-primary" },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              Welcome back, {getFirstName()} 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              {hasFarm ? `Managing ${farmData?.name || 'your farm'}` : "Here's what's happening on your farm today"}
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/climate-alerts">
              <Bell className="w-4 h-4 mr-2" />
              Alerts
            </Link>
          </Button>
        </div>

        {!hasFarm && (
          <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Register Your Farm</h3>
                    <p className="text-sm text-muted-foreground">Get your Climate Smart Agric Kit to unlock all features</p>
                  </div>
                </div>
                <Button asChild>
                  <Link to="/register-farm">
                    Register Now
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Real-time Weather Section with Animation */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Sun className="w-5 h-5 text-secondary" />
            Real-time Weather
          </h2>
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0">
              <img 
                src={aerialFarm} 
                alt="Farm landscape" 
                className="w-full h-full object-cover opacity-40"
              />
              <WeatherAnimation 
                condition={weather.condition.toLowerCase().includes("rain") ? "rain" : 
                          weather.condition.toLowerCase().includes("cloud") ? "cloudy" : "sunny"} 
                intensity="light" 
              />
            </div>
            <CardContent className="relative z-20 p-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-card/90 backdrop-blur rounded-xl p-4 text-center border border-border/50">
                  <Thermometer className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{weather.temperature}°C</p>
                  <p className="text-xs text-muted-foreground">Temperature</p>
                </div>
                <div className="bg-card/90 backdrop-blur rounded-xl p-4 text-center border border-border/50">
                  <Droplets className="w-8 h-8 text-accent mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{weather.humidity}%</p>
                  <p className="text-xs text-muted-foreground">Humidity</p>
                </div>
                <div className="bg-card/90 backdrop-blur rounded-xl p-4 text-center border border-border/50">
                  <Wind className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{weather.windSpeed} km/h</p>
                  <p className="text-xs text-muted-foreground">Wind Speed</p>
                </div>
                <div className="bg-card/90 backdrop-blur rounded-xl p-4 text-center border border-border/50">
                  {weather.condition.toLowerCase().includes("rain") ? (
                    <CloudRain className="w-8 h-8 text-accent mx-auto mb-2 animate-pulse" />
                  ) : weather.condition.toLowerCase().includes("cloud") ? (
                    <CloudSun className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  ) : (
                    <Sun className="w-8 h-8 text-secondary mx-auto mb-2 animate-pulse-slow" />
                  )}
                  <p className="text-lg font-bold text-foreground">{weather.condition}</p>
                  <p className="text-xs text-muted-foreground">Condition</p>
                </div>
                <div className="bg-card/90 backdrop-blur rounded-xl p-4 text-center border border-border/50 col-span-2 md:col-span-1">
                  <Eye className="w-8 h-8 text-warning mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">{weather.forecast}</p>
                  <p className="text-xs text-muted-foreground">Forecast</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Last Soil Readings */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-accent" />
              Last Soil Readings
            </h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/soil-testing">
                View Details
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-2">
                  <span className="text-success font-bold text-sm">N</span>
                </div>
                <p className="text-xl font-bold text-foreground">{soilReadings.nitrogen}%</p>
                <p className="text-xs text-muted-foreground">Nitrogen</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                  <span className="text-primary font-bold text-sm">P</span>
                </div>
                <p className="text-xl font-bold text-foreground">{soilReadings.phosphorus}%</p>
                <p className="text-xs text-muted-foreground">Phosphorus</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-2">
                  <span className="text-secondary font-bold text-sm">K</span>
                </div>
                <p className="text-xl font-bold text-foreground">{soilReadings.potassium}%</p>
                <p className="text-xs text-muted-foreground">Potassium</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Droplets className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="text-xl font-bold text-foreground">{soilReadings.moisture}%</p>
                <p className="text-xs text-muted-foreground">Moisture</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Thermometer className="w-6 h-6 text-warning mx-auto mb-2" />
                <p className="text-xl font-bold text-foreground">{soilReadings.temperature}°C</p>
                <p className="text-xs text-muted-foreground">Soil Temp</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action, index) => (
              <Link 
                key={index}
                to={action.href} 
                className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all text-center card-hover"
              >
                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mx-auto mb-3`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-foreground">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recommended Crops & Animals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sprout className="w-5 h-5 text-success" />
                Recommended Crops
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendedCrops.map((crop, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-foreground">{crop.name}</p>
                      <p className="text-xs text-muted-foreground">{crop.reason}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-success">{crop.suitability}%</span>
                      <p className="text-xs text-muted-foreground">match</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Leaf className="w-5 h-5 text-primary" />
                Recommended Animals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendedAnimals.map((animal, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-foreground">{animal.name}</p>
                      <p className="text-xs text-muted-foreground">{animal.reason}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-primary">{animal.suitability}%</span>
                      <p className="text-xs text-muted-foreground">match</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Credit Score Banner */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                  <CreditCard className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Your Agriculture Credit Score</h3>
                  <p className="text-sm text-muted-foreground">Access loans and insurance based on your score</p>
                </div>
              </div>
              <Button asChild>
                <Link to="/credit-score">
                  View Score
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
