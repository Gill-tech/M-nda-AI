import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageSidebar, SidebarSection } from "@/components/PageSidebar";
import { useAuth } from "@/contexts/AuthContext";
import {
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Thermometer,
  Droplets,
  AlertTriangle,
  Bell,
  MapPin,
  Calendar,
  ArrowRight,
  Leaf,
  Bug,
  TrendingUp,
  Shield,
  Umbrella,
  Waves,
  Snowflake,
  Flame,
  Zap,
  Eye
} from "lucide-react";

interface WeatherAlert {
  id: string;
  type: "drought" | "flood" | "frost" | "pest" | "heat";
  severity: "low" | "medium" | "high";
  title: string;
  description: string;
  region: string;
  date: string;
  recommendation: string;
}

const mockAlerts: WeatherAlert[] = [
  {
    id: "1",
    type: "drought",
    severity: "high",
    title: "Drought Warning - Nakuru County",
    description: "Rainfall levels 40% below normal. Expect dry conditions for the next 2 weeks.",
    region: "Nakuru",
    date: "2024-12-03",
    recommendation: "Reduce irrigation frequency but increase depth. Consider drought-resistant crop varieties."
  },
  {
    id: "2",
    type: "pest",
    severity: "medium",
    title: "Fall Armyworm Alert - Rift Valley",
    description: "Increased armyworm activity detected in neighboring farms. Monitor crops closely.",
    region: "Rift Valley",
    date: "2024-12-02",
    recommendation: "Scout crops early morning. Apply recommended pesticides if infestation exceeds threshold."
  },
  {
    id: "3",
    type: "flood",
    severity: "low",
    title: "Heavy Rainfall Expected - Kisumu",
    description: "Above-average rainfall predicted for the next 5 days.",
    region: "Kisumu",
    date: "2024-12-01",
    recommendation: "Ensure proper drainage. Delay any planned fertilizer application."
  }
];

const weatherData = {
  current: {
    temp: 24,
    humidity: 65,
    windSpeed: 12,
    condition: "Partly Cloudy",
    rainfall: 2.5,
    soilMoisture: 42
  },
  forecast: [
    { day: "Mon", high: 26, low: 18, rain: 10 },
    { day: "Tue", high: 25, low: 17, rain: 30 },
    { day: "Wed", high: 23, low: 16, rain: 60 },
    { day: "Thu", high: 24, low: 17, rain: 40 },
    { day: "Fri", high: 27, low: 19, rain: 5 },
  ]
};

const ClimateAlerts = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedAlert, setSelectedAlert] = useState<WeatherAlert | null>(null);

  // Sidebar sections for Climate Alerts
  const climateSidebar: SidebarSection[] = [
    {
      id: "weather-reading",
      title: "Reading Weather Data",
      icon: Eye,
      status: "neutral",
      content: (
        <div className="space-y-3">
          <p><strong>Understanding Weather Metrics</strong></p>
          <div className="mt-3 space-y-2">
            <div className="p-2 bg-muted rounded">
              <p className="text-xs font-medium">Temperature</p>
              <p className="text-xs mt-1">Affects crop growth rates and pest activity. Most crops thrive between 18-28°C.</p>
              <ul className="text-xs mt-1 list-disc list-inside text-muted-foreground">
                <li>Below 15°C: Slow growth, frost risk</li>
                <li>15-25°C: Optimal for most crops</li>
                <li>Above 30°C: Heat stress, wilting</li>
              </ul>
            </div>
            <div className="p-2 bg-muted rounded">
              <p className="text-xs font-medium">Humidity</p>
              <p className="text-xs mt-1">High humidity increases disease risk, low humidity causes water stress.</p>
              <ul className="text-xs mt-1 list-disc list-inside text-muted-foreground">
                <li>Below 40%: Irrigation needed</li>
                <li>50-70%: Ideal range</li>
                <li>Above 80%: Fungal disease risk</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "drought-management",
      title: "Drought Management",
      icon: Sun,
      status: "warning",
      content: (
        <div className="space-y-3">
          <p><strong>Preparing for Dry Conditions</strong></p>
          <p className="text-xs">Drought is one of the biggest threats to Kenya farmers. Here's how to prepare:</p>
          <div className="mt-3 p-2 bg-warning/10 rounded">
            <p className="text-xs font-medium mb-2">Early Warning Signs:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Delayed onset of rains</li>
              <li>Shorter rainy season forecast</li>
              <li>High daytime temperatures</li>
              <li>Low soil moisture readings</li>
            </ul>
          </div>
          <div className="mt-3 p-2 bg-success/10 rounded">
            <p className="text-xs font-medium mb-2">Mitigation Strategies:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Plant drought-resistant varieties (e.g., DUMA maize)</li>
              <li>Use mulching to retain soil moisture</li>
              <li>Practice water harvesting</li>
              <li>Reduce plant population density</li>
              <li>Apply drip irrigation if available</li>
              <li>Consider early maturing varieties</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "flood-prevention",
      title: "Flood Prevention",
      icon: Waves,
      status: "neutral",
      content: (
        <div className="space-y-3">
          <p><strong>Managing Excess Water</strong></p>
          <p className="text-xs">Too much rain can be as damaging as too little. Protect your crops from waterlogging:</p>
          <div className="mt-3 p-2 bg-accent/10 rounded">
            <p className="text-xs font-medium mb-2">Flood Damage Risks:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Root rot and oxygen starvation</li>
              <li>Nutrient leaching from soil</li>
              <li>Increased disease pressure</li>
              <li>Soil erosion and crop lodging</li>
            </ul>
          </div>
          <div className="mt-3 p-2 bg-success/10 rounded">
            <p className="text-xs font-medium mb-2">Prevention Measures:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Dig drainage channels before rains</li>
              <li>Plant on raised beds in flood-prone areas</li>
              <li>Avoid planting in low-lying fields</li>
              <li>Use cover crops to prevent erosion</li>
              <li>Build terraces on slopes</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "pest-disease",
      title: "Pest & Disease Alerts",
      icon: Bug,
      status: "warning",
      content: (
        <div className="space-y-3">
          <p><strong>Common Threats in Kenya</strong></p>
          <div className="mt-3 space-y-2">
            <div className="p-2 bg-destructive/10 rounded border-l-4 border-destructive">
              <p className="text-xs font-medium">Fall Armyworm (FAW)</p>
              <p className="text-xs mt-1">Most destructive pest in East Africa. Attacks maize, sorghum, millet.</p>
              <p className="text-xs text-muted-foreground mt-1">Treatment: Emamectin benzoate, Spinetoram</p>
            </div>
            <div className="p-2 bg-warning/10 rounded border-l-4 border-warning">
              <p className="text-xs font-medium">Maize Lethal Necrosis (MLN)</p>
              <p className="text-xs mt-1">Viral disease causing complete crop loss. Spread by aphids and thrips.</p>
              <p className="text-xs text-muted-foreground mt-1">Prevention: Certified seed, crop rotation</p>
            </div>
            <div className="p-2 bg-primary/10 rounded border-l-4 border-primary">
              <p className="text-xs font-medium">Late Blight (Tomatoes/Potatoes)</p>
              <p className="text-xs mt-1">Fungal disease in wet conditions. Can destroy crop in days.</p>
              <p className="text-xs text-muted-foreground mt-1">Treatment: Metalaxyl, Mancozeb fungicides</p>
            </div>
          </div>
          <div className="mt-3 p-2 bg-muted rounded">
            <p className="text-xs font-medium">Scout your crops weekly! Early detection saves crops.</p>
          </div>
        </div>
      )
    },
    {
      id: "weather-insurance",
      title: "Weather Insurance",
      icon: Shield,
      status: "good",
      content: (
        <div className="space-y-3">
          <p><strong>Protect Your Investment</strong></p>
          <p className="text-xs">Parametric insurance automatically pays out when weather thresholds are triggered.</p>
          <div className="mt-3 p-2 bg-success/10 rounded">
            <p className="text-xs font-medium mb-2">How It Works:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Sensors monitor rainfall, temperature</li>
              <li>If drought/flood threshold breached</li>
              <li>Automatic payout to your M-Pesa</li>
              <li>No claims process needed!</li>
            </ul>
          </div>
          <div className="mt-3 p-2 bg-primary/10 rounded">
            <p className="text-xs font-medium mb-2">Coverage Options:</p>
            <ul className="text-xs space-y-1">
              <li>• Drought insurance: KES 2,000-5,000/season</li>
              <li>• Flood insurance: KES 1,500-3,000/season</li>
              <li>• Combined coverage: KES 3,000-7,000/season</li>
            </ul>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Check your Credit Score page for insurance options.</p>
        </div>
      )
    },
    {
      id: "seasonal-planning",
      title: "Seasonal Planning",
      icon: Calendar,
      status: "neutral",
      content: (
        <div className="space-y-3">
          <p><strong>Kenya Farming Calendar</strong></p>
          <div className="mt-3 space-y-2">
            <div className="p-2 bg-success/10 rounded">
              <p className="text-xs font-medium">Long Rains (March-May)</p>
              <ul className="text-xs mt-1 list-disc list-inside">
                <li>Main planting season</li>
                <li>Plant maize, beans, potatoes</li>
                <li>Peak rainfall in April</li>
              </ul>
            </div>
            <div className="p-2 bg-warning/10 rounded">
              <p className="text-xs font-medium">Cool Dry (June-August)</p>
              <ul className="text-xs mt-1 list-disc list-inside">
                <li>Harvest long rains crops</li>
                <li>Land preparation for short rains</li>
                <li>Plant cool-season vegetables</li>
              </ul>
            </div>
            <div className="p-2 bg-accent/10 rounded">
              <p className="text-xs font-medium">Short Rains (Oct-Dec)</p>
              <ul className="text-xs mt-1 list-disc list-inside">
                <li>Second planting season</li>
                <li>Plant fast-maturing varieties</li>
                <li>High pest pressure period</li>
              </ul>
            </div>
            <div className="p-2 bg-secondary/10 rounded">
              <p className="text-xs font-medium">Hot Dry (Jan-Feb)</p>
              <ul className="text-xs mt-1 list-disc list-inside">
                <li>Irrigation crops only</li>
                <li>Prepare for long rains</li>
                <li>Soil testing recommended</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": return "bg-warning/10 text-warning border-warning/20";
      default: return "bg-accent/10 text-accent border-accent/20";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "drought": return Sun;
      case "flood": return CloudRain;
      case "frost": return Snowflake;
      case "pest": return Bug;
      case "heat": return Flame;
      default: return AlertTriangle;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              Climate & Weather Alerts
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time climate intelligence and early warning system for your farm
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Manage Alerts
            </Button>
            <Button variant="outline" size="sm">
              <MapPin className="w-4 h-4 mr-2" />
              Change Location
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="xl:col-span-1 order-2 xl:order-1">
            <PageSidebar title="Climate Guide" sections={climateSidebar} />
          </div>

          {/* Main Content */}
          <div className="xl:col-span-3 order-1 xl:order-2 space-y-6">
            {/* Current Weather */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-primary/10 border border-border">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Current Conditions</h2>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Nakuru County, Kenya
                    </p>
                  </div>
                  <Cloud className="w-16 h-16 text-accent" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Thermometer className="w-4 h-4" />
                      <span className="text-sm">Temperature</span>
                    </div>
                    <div className="text-3xl font-display font-bold text-foreground">{weatherData.current.temp}°C</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Droplets className="w-4 h-4" />
                      <span className="text-sm">Humidity</span>
                    </div>
                    <div className="text-3xl font-display font-bold text-foreground">{weatherData.current.humidity}%</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Wind className="w-4 h-4" />
                      <span className="text-sm">Wind Speed</span>
                    </div>
                    <div className="text-3xl font-display font-bold text-foreground">{weatherData.current.windSpeed} km/h</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <CloudRain className="w-4 h-4" />
                      <span className="text-sm">Rainfall (24h)</span>
                    </div>
                    <div className="text-3xl font-display font-bold text-foreground">{weatherData.current.rainfall} mm</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Leaf className="w-4 h-4" />
                      <span className="text-sm">Soil Moisture</span>
                    </div>
                    <div className="text-3xl font-display font-bold text-success">{weatherData.current.soilMoisture}%</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Sun className="w-4 h-4" />
                      <span className="text-sm">Conditions</span>
                    </div>
                    <div className="text-lg font-semibold text-foreground">{weatherData.current.condition}</div>
                  </div>
                </div>
              </div>

              {/* 5-Day Forecast */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">5-Day Forecast</h2>
                <div className="space-y-3">
                  {weatherData.forecast.map((day, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="font-medium text-foreground w-12">{day.day}</span>
                      <div className="flex items-center gap-2">
                        {day.rain > 40 ? <CloudRain className="w-4 h-4 text-accent" /> : <Sun className="w-4 h-4 text-secondary" />}
                        <span className="text-sm text-muted-foreground">{day.rain}%</span>
                      </div>
                      <span className="text-sm text-foreground">{day.high}° / {day.low}°</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Alerts */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Active Alerts</h2>
                <span className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-medium">
                  {mockAlerts.length} Active
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockAlerts.map((alert) => {
                  const AlertIcon = getAlertIcon(alert.type);
                  return (
                    <div
                      key={alert.id}
                      className={`p-5 rounded-xl border cursor-pointer transition-all hover:shadow-md ${getSeverityColor(alert.severity)}`}
                      onClick={() => setSelectedAlert(alert)}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-background/50 flex items-center justify-center">
                          <AlertIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">{alert.title}</h3>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(alert.date).toLocaleDateString("en-KE", { month: "short", day: "numeric" })}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{alert.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Farming Recommendations */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">AI-Powered Farming Recommendations</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-success/5 border border-success/20">
                  <Leaf className="w-6 h-6 text-success mb-2" />
                  <h3 className="font-medium text-foreground mb-1">Optimal Planting</h3>
                  <p className="text-sm text-muted-foreground">
                    Current soil moisture is ideal for maize planting. Consider sowing within the next 5 days.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
                  <Droplets className="w-6 h-6 text-warning mb-2" />
                  <h3 className="font-medium text-foreground mb-1">Irrigation Advisory</h3>
                  <p className="text-sm text-muted-foreground">
                    Reduce irrigation by 20% this week due to expected rainfall on Wednesday.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
                  <TrendingUp className="w-6 h-6 text-accent mb-2" />
                  <h3 className="font-medium text-foreground mb-1">Harvest Timing</h3>
                  <p className="text-sm text-muted-foreground">
                    Dry conditions next week are ideal for harvesting mature crops. Plan accordingly.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Alert Detail Modal */}
        {selectedAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg p-6 rounded-2xl bg-card border border-border shadow-xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getSeverityColor(selectedAlert.severity)}`}>
                    {(() => {
                      const Icon = getAlertIcon(selectedAlert.type);
                      return <Icon className="w-6 h-6" />;
                    })()}
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">{selectedAlert.title}</h2>
                    <p className="text-sm text-muted-foreground">{selectedAlert.region}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedAlert(null)}>✕</Button>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-1">Description</h3>
                  <p className="text-sm text-muted-foreground">{selectedAlert.description}</p>
                </div>
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <h3 className="text-sm font-medium text-primary mb-1 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Recommended Action
                  </h3>
                  <p className="text-sm text-muted-foreground">{selectedAlert.recommendation}</p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button className="flex-1" onClick={() => setSelectedAlert(null)}>
                  Take Action
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" onClick={() => setSelectedAlert(null)}>Dismiss</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClimateAlerts;
