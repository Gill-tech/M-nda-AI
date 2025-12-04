import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageSidebar, SidebarSection } from "@/components/PageSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import soilCloseup from "@/assets/soil-closeup.jpg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { 
  FlaskConical, 
  Droplets, 
  Thermometer, 
  Wind,
  Leaf,
  Brain,
  Sprout,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Save,
  Beaker,
  Zap,
  Target,
  Gauge
} from "lucide-react";

const SoilTesting = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);

  // Soil Kit Data
  const [soilData, setSoilData] = useState({
    nitrogen: 45,
    phosphorus: 32,
    potassium: 28,
    humidity: 65,
    temperature: 24,
    moistureLevel: 42,
    windSpeed: 12,
    ph: 6.5,
    lastUpdated: new Date().toISOString()
  });

  // AI Predictions
  const [predictions, setPredictions] = useState({
    soilHealth: 78,
    yieldPotential: 85,
    riskLevel: "low",
    recommendations: [
      "Increase nitrogen application by 15%",
      "Optimal planting window: Next 2 weeks",
      "Consider drip irrigation for water efficiency"
    ]
  });

  // Crop Recommendations
  const [cropRecommendations, setCropRecommendations] = useState([
    { name: "Maize", suitability: 92, season: "Long rains", duration: "90-120 days" },
    { name: "Beans", suitability: 88, season: "Short rains", duration: "60-90 days" },
    { name: "Tomatoes", suitability: 85, season: "Year-round", duration: "60-80 days" },
    { name: "Cabbage", suitability: 82, season: "Cool season", duration: "70-100 days" },
    { name: "Potatoes", suitability: 79, season: "Cool highlands", duration: "90-120 days" }
  ]);

  // Crop Metadata & Guide
  const cropGuide = [
    {
      id: "land-preparation",
      title: "Land Preparation",
      icon: Leaf,
      content: "Clear the land of weeds and debris. Test soil pH and nutrients. Apply lime if soil is too acidic. Create proper drainage channels to prevent waterlogging."
    },
    {
      id: "ploughing",
      title: "Ploughing",
      icon: TrendingUp,
      content: "Plough to a depth of 20-30cm. Break large clods into fine tilth. Create furrows for proper water drainage. Time ploughing 2-3 weeks before planting."
    },
    {
      id: "sowing",
      title: "Sowing",
      icon: Sprout,
      content: "Use certified seeds from reputable sources. Maintain proper spacing: Maize (75x25cm), Beans (45x15cm). Plant at the onset of rains. Seed depth: 2-5cm depending on crop."
    },
    {
      id: "nutrients",
      title: "Nutrients Application",
      icon: FlaskConical,
      content: "Apply DAP at planting (50kg/acre). Top-dress with CAN at knee-high stage. Use foliar feeds during flowering. Based on your soil: Add 15% more nitrogen."
    },
    {
      id: "irrigation",
      title: "Irrigation",
      icon: Droplets,
      content: "Water requirement varies by crop and stage. Drip irrigation most efficient (90% efficiency). Furrow irrigation for row crops. Irrigate early morning or late evening."
    },
    {
      id: "pests-diseases",
      title: "Pests & Disease Advisory",
      icon: AlertTriangle,
      content: "Scout fields weekly for pests. Common pests: Fall armyworm, aphids, cutworms. Integrated Pest Management (IPM) recommended. Rotate pesticides to prevent resistance."
    },
    {
      id: "harvesting",
      title: "Harvesting",
      icon: CheckCircle,
      content: "Harvest at physiological maturity. Maize: When husks turn brown, grain moisture 20-25%. Beans: When pods turn yellow. Harvest during dry weather to prevent losses."
    },
    {
      id: "storage",
      title: "Storage",
      icon: BookOpen,
      content: "Dry grains to 13% moisture or below. Use hermetic bags or metal silos. Treat with recommended grain protectants. Store in cool, dry, well-ventilated area."
    },
    {
      id: "intercropping",
      title: "Intercropping & Rotation",
      icon: RefreshCw,
      content: "Maize-bean intercropping increases yield by 20-30%. Rotate cereals with legumes. Avoid planting same crop family consecutively. Benefits: Pest control, soil fertility, risk reduction."
    }
  ];

  // Sidebar sections for Soil Testing
  const soilTestingSidebar: SidebarSection[] = [
    {
      id: "nitrogen",
      title: "Nitrogen (N)",
      icon: Beaker,
      value: `${soilData.nitrogen}%`,
      status: soilData.nitrogen >= 40 ? "good" : soilData.nitrogen >= 25 ? "warning" : "danger",
      content: (
        <div className="space-y-3">
          <p><strong>Current Level:</strong> {soilData.nitrogen}% - {soilData.nitrogen >= 40 ? "Optimal" : soilData.nitrogen >= 25 ? "Moderate" : "Low"}</p>
          <p><strong>What is Nitrogen?</strong></p>
          <p>Nitrogen is essential for leaf and stem growth. It's a key component of chlorophyll, which gives plants their green color and enables photosynthesis.</p>
          <div className="mt-3 p-2 bg-muted rounded">
            <p className="text-xs font-medium mb-2">Role in Plant Growth:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Promotes vegetative growth (leaves, stems)</li>
              <li>Essential for protein synthesis</li>
              <li>Part of chlorophyll molecule</li>
              <li>Improves crop yield and quality</li>
            </ul>
          </div>
          <div className="mt-3 p-2 bg-primary/10 rounded">
            <p className="text-xs font-medium mb-2">Deficiency Signs:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Yellowing of older leaves (chlorosis)</li>
              <li>Stunted growth</li>
              <li>Reduced tillering in cereals</li>
              <li>Pale green foliage</li>
            </ul>
          </div>
          <div className="mt-3 p-2 bg-success/10 rounded">
            <p className="text-xs font-medium mb-2">How to Increase:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Apply CAN (Calcium Ammonium Nitrate) - 100kg/ha</li>
              <li>Use Urea fertilizer - 50kg/ha</li>
              <li>Plant legumes (fix atmospheric nitrogen)</li>
              <li>Add organic manure or compost</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "phosphorus",
      title: "Phosphorus (P)",
      icon: Zap,
      value: `${soilData.phosphorus}%`,
      status: soilData.phosphorus >= 40 ? "good" : soilData.phosphorus >= 25 ? "warning" : "danger",
      content: (
        <div className="space-y-3">
          <p><strong>Current Level:</strong> {soilData.phosphorus}% - {soilData.phosphorus >= 40 ? "Optimal" : soilData.phosphorus >= 25 ? "Moderate" : "Low"}</p>
          <p><strong>What is Phosphorus?</strong></p>
          <p>Phosphorus is crucial for root development, flowering, and fruiting. It's involved in energy transfer within the plant and is essential for DNA and RNA.</p>
          <div className="mt-3 p-2 bg-muted rounded">
            <p className="text-xs font-medium mb-2">Role in Plant Growth:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Root development and establishment</li>
              <li>Flower and seed formation</li>
              <li>Energy transfer (ATP)</li>
              <li>Early crop maturity</li>
            </ul>
          </div>
          <div className="mt-3 p-2 bg-primary/10 rounded">
            <p className="text-xs font-medium mb-2">Deficiency Signs:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Purple or reddish discoloration of leaves</li>
              <li>Poor root development</li>
              <li>Delayed maturity</li>
              <li>Reduced flowering and fruiting</li>
            </ul>
          </div>
          <div className="mt-3 p-2 bg-success/10 rounded">
            <p className="text-xs font-medium mb-2">How to Increase:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Apply DAP (Diammonium Phosphate) - 50kg/acre</li>
              <li>Use TSP (Triple Super Phosphate)</li>
              <li>Add bone meal (organic option)</li>
              <li>Maintain soil pH 6.0-7.0 for availability</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "potassium",
      title: "Potassium (K)",
      icon: Target,
      value: `${soilData.potassium}%`,
      status: soilData.potassium >= 40 ? "good" : soilData.potassium >= 25 ? "warning" : "danger",
      content: (
        <div className="space-y-3">
          <p><strong>Current Level:</strong> {soilData.potassium}% - {soilData.potassium >= 40 ? "Optimal" : soilData.potassium >= 25 ? "Moderate" : "Low"}</p>
          <p><strong>What is Potassium?</strong></p>
          <p>Potassium regulates water uptake, enzyme activation, and photosynthesis. It improves disease resistance and overall plant vigor.</p>
          <div className="mt-3 p-2 bg-muted rounded">
            <p className="text-xs font-medium mb-2">Role in Plant Growth:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Water regulation (stomatal control)</li>
              <li>Disease and pest resistance</li>
              <li>Enzyme activation</li>
              <li>Improves fruit quality and shelf life</li>
            </ul>
          </div>
          <div className="mt-3 p-2 bg-primary/10 rounded">
            <p className="text-xs font-medium mb-2">Deficiency Signs:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Browning of leaf edges (scorch)</li>
              <li>Weak stems, prone to lodging</li>
              <li>Poor fruit quality</li>
              <li>Increased disease susceptibility</li>
            </ul>
          </div>
          <div className="mt-3 p-2 bg-success/10 rounded">
            <p className="text-xs font-medium mb-2">How to Increase:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Apply MOP (Muriate of Potash) - 50kg/ha</li>
              <li>Use NPK compound fertilizers</li>
              <li>Add wood ash (organic option)</li>
              <li>Use banana stem mulch</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "humidity",
      title: "Humidity",
      icon: Droplets,
      value: `${soilData.humidity}%`,
      status: soilData.humidity >= 50 && soilData.humidity <= 80 ? "good" : "warning",
      content: (
        <div className="space-y-3">
          <p><strong>Current Level:</strong> {soilData.humidity}% - {soilData.humidity >= 50 && soilData.humidity <= 80 ? "Optimal" : "Needs Attention"}</p>
          <p><strong>What is Humidity?</strong></p>
          <p>Atmospheric humidity affects transpiration, disease development, and pollination. It's the amount of water vapor in the air.</p>
          <div className="mt-3 p-2 bg-muted rounded">
            <p className="text-xs font-medium mb-2">Impact on Crops:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>High humidity (above 80%): Increased fungal diseases</li>
              <li>Low humidity (below 40%): Water stress, poor pollination</li>
              <li>Optimal range: 50-70% for most crops</li>
              <li>Affects pesticide effectiveness</li>
            </ul>
          </div>
          <div className="mt-3 p-2 bg-warning/10 rounded">
            <p className="text-xs font-medium mb-2">Management Tips:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Improve air circulation with proper spacing</li>
              <li>Irrigate early morning to reduce leaf wetness</li>
              <li>Use fungicides preventively in humid conditions</li>
              <li>Consider shade nets in very dry conditions</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "temperature",
      title: "Temperature",
      icon: Thermometer,
      value: `${soilData.temperature}°C`,
      status: soilData.temperature >= 18 && soilData.temperature <= 30 ? "good" : "warning",
      content: (
        <div className="space-y-3">
          <p><strong>Current Level:</strong> {soilData.temperature}°C - {soilData.temperature >= 18 && soilData.temperature <= 30 ? "Optimal" : "Monitor"}</p>
          <p><strong>What is Soil Temperature?</strong></p>
          <p>Soil temperature affects seed germination, root growth, and nutrient availability. It's measured at root zone depth (5-10cm).</p>
          <div className="mt-3 p-2 bg-muted rounded">
            <p className="text-xs font-medium mb-2">Optimal Ranges by Crop:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Maize germination: 18-35°C (optimal 25-30°C)</li>
              <li>Beans: 15-30°C (optimal 20-25°C)</li>
              <li>Tomatoes: 18-30°C (optimal 21-27°C)</li>
              <li>Cabbage: 15-25°C (cool season crop)</li>
            </ul>
          </div>
          <div className="mt-3 p-2 bg-success/10 rounded">
            <p className="text-xs font-medium mb-2">Temperature Effects:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Below 15°C: Slow root growth, nutrient lockout</li>
              <li>15-25°C: Optimal for most crops</li>
              <li>Above 35°C: Heat stress, reduced yields</li>
              <li>Use mulch to regulate soil temperature</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "moisture",
      title: "Moisture Level",
      icon: Droplets,
      value: `${soilData.moistureLevel}%`,
      status: soilData.moistureLevel >= 30 && soilData.moistureLevel <= 60 ? "good" : "warning",
      content: (
        <div className="space-y-3">
          <p><strong>Current Level:</strong> {soilData.moistureLevel}% - {soilData.moistureLevel >= 30 && soilData.moistureLevel <= 60 ? "Optimal" : "Adjust Irrigation"}</p>
          <p><strong>What is Soil Moisture?</strong></p>
          <p>Soil moisture is the water content in the soil. It's critical for nutrient uptake and plant metabolism.</p>
          <div className="mt-3 p-2 bg-muted rounded">
            <p className="text-xs font-medium mb-2">Moisture Guidelines:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>0-20%: Wilting point - urgent irrigation needed</li>
              <li>20-40%: Moderate stress - schedule irrigation</li>
              <li>40-60%: Field capacity - optimal range</li>
              <li>60-80%: Saturated - reduce watering</li>
              <li>Above 80%: Waterlogged - drainage needed</li>
            </ul>
          </div>
          <div className="mt-3 p-2 bg-primary/10 rounded">
            <p className="text-xs font-medium mb-2">Irrigation Scheduling:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Sandy soil: Irrigate when moisture drops to 50%</li>
              <li>Loamy soil: Irrigate at 40% moisture</li>
              <li>Clay soil: Irrigate at 35% moisture</li>
              <li>Use drip irrigation for 90% efficiency</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "wind-speed",
      title: "Wind Speed",
      icon: Wind,
      value: `${soilData.windSpeed} km/h`,
      status: soilData.windSpeed <= 20 ? "good" : soilData.windSpeed <= 40 ? "warning" : "danger",
      content: (
        <div className="space-y-3">
          <p><strong>Current Level:</strong> {soilData.windSpeed} km/h - {soilData.windSpeed <= 20 ? "Calm" : soilData.windSpeed <= 40 ? "Moderate" : "High"}</p>
          <p><strong>Why Monitor Wind?</strong></p>
          <p>Wind affects evapotranspiration, spray drift, and can cause physical damage to crops.</p>
          <div className="mt-3 p-2 bg-muted rounded">
            <p className="text-xs font-medium mb-2">Wind Impact:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>0-10 km/h: Ideal for spraying</li>
              <li>10-20 km/h: Acceptable, monitor drift</li>
              <li>20-40 km/h: Avoid spraying, increased evaporation</li>
              <li>Above 40 km/h: Risk of lodging, protect young plants</li>
            </ul>
          </div>
          <div className="mt-3 p-2 bg-success/10 rounded">
            <p className="text-xs font-medium mb-2">Windbreak Benefits:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Plant trees or hedges as windbreaks</li>
              <li>Reduces evapotranspiration by 20-30%</li>
              <li>Protects crops from mechanical damage</li>
              <li>Creates microclimate for sensitive crops</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "soil-ph",
      title: "Soil pH",
      icon: Gauge,
      value: soilData.ph.toString(),
      status: soilData.ph >= 6.0 && soilData.ph <= 7.5 ? "good" : "warning",
      content: (
        <div className="space-y-3">
          <p><strong>Current Level:</strong> {soilData.ph} - {soilData.ph >= 6.0 && soilData.ph <= 7.5 ? "Optimal" : soilData.ph < 6.0 ? "Acidic" : "Alkaline"}</p>
          <p><strong>What is Soil pH?</strong></p>
          <p>Soil pH measures acidity or alkalinity on a scale of 0-14. It affects nutrient availability and microbial activity.</p>
          <div className="mt-3 p-2 bg-muted rounded">
            <p className="text-xs font-medium mb-2">pH Ranges:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Below 5.5: Strongly acidic - aluminum toxicity risk</li>
              <li>5.5-6.5: Slightly acidic - good for most crops</li>
              <li>6.5-7.5: Neutral - optimal for nutrient availability</li>
              <li>7.5-8.5: Alkaline - iron deficiency risk</li>
              <li>Above 8.5: Strongly alkaline - poor nutrient availability</li>
            </ul>
          </div>
          <div className="mt-3 p-2 bg-primary/10 rounded">
            <p className="text-xs font-medium mb-2">pH Adjustment:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li><strong>To raise pH (acidic soil):</strong> Add agricultural lime (CaCO3) - 2-4 tonnes/ha</li>
              <li><strong>To lower pH (alkaline soil):</strong> Add elemental sulfur or acidifying fertilizers</li>
              <li>Test pH 2-3 months after liming</li>
              <li>Optimal pH for maize: 5.8-7.0</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Fetch existing soil readings
  useEffect(() => {
    const fetchSoilReadings = async () => {
      if (user) {
        const { data } = await supabase
          .from('soil_readings')
          .select('*')
          .eq('user_id', user.id)
          .order('reading_date', { ascending: false })
          .limit(1);

        if (data && data.length > 0) {
          const reading = data[0];
          setHasExistingData(true);
          setSoilData({
            nitrogen: reading.nitrogen_level || 45,
            phosphorus: reading.phosphorus_level || 32,
            potassium: reading.potassium_level || 28,
            humidity: reading.humidity || 65,
            temperature: reading.temperature || 24,
            moistureLevel: reading.moisture_level || 42,
            windSpeed: reading.wind_speed || 12,
            ph: reading.soil_ph || 6.5,
            lastUpdated: reading.reading_date
          });
        }
      }
    };
    fetchSoilReadings();
  }, [user]);

  const saveSoilReading = async () => {
    if (!user) return;
    setIsSaving(true);
    
    const { error } = await supabase.from('soil_readings').insert({
      user_id: user.id,
      nitrogen_level: soilData.nitrogen,
      phosphorus_level: soilData.phosphorus,
      potassium_level: soilData.potassium,
      soil_ph: soilData.ph,
      humidity: soilData.humidity,
      temperature: soilData.temperature,
      moisture_level: soilData.moistureLevel,
      wind_speed: soilData.windSpeed,
      reading_date: new Date().toISOString()
    });

    if (error) {
      toast.error("Failed to save soil reading");
    } else {
      toast.success("Soil reading saved successfully");
      setSoilData({ ...soilData, lastUpdated: new Date().toISOString() });
    }
    setIsSaving(false);
  };

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setPredictions({
        ...predictions,
        soilHealth: Math.floor(Math.random() * 20) + 75,
        yieldPotential: Math.floor(Math.random() * 15) + 80,
      });
      setIsAnalyzing(false);
      toast.success("Analysis complete!");
    }, 2000);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const getNutrientStatus = (value: number) => {
    if (value >= 40) return { status: "Optimal", color: "text-success" };
    if (value >= 25) return { status: "Moderate", color: "text-warning" };
    return { status: "Low", color: "text-destructive" };
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground flex items-center gap-3">
              <FlaskConical className="w-8 h-8 text-accent" />
              Soil Testing Kit
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time soil data from your Climate Smart Agric Kit
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={saveSoilReading} disabled={isSaving} variant="outline">
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Reading
            </Button>
            <Button onClick={runAnalysis} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Data
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Hero Banner with Soil Image */}
        <div className="relative h-48 rounded-2xl overflow-hidden mb-8">
          <img 
            src={soilCloseup} 
            alt="Soil testing" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
          <div className="absolute inset-0 p-6 flex flex-col justify-center">
            <p className="text-muted-foreground text-sm mb-2">Last updated: {new Date(soilData.lastUpdated).toLocaleString()}</p>
            <p className="text-foreground text-lg max-w-md">
              Your Climate Smart Agric Kit is actively monitoring soil conditions in real-time.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Sidebar with detailed dropdowns */}
          <div className="xl:col-span-1">
            <PageSidebar 
              title="Sensor Readings" 
              sections={soilTestingSidebar}
            />
          </div>

          {/* Main Content */}
          <div className="xl:col-span-3 space-y-8">
            {/* Soil Nutrients Section */}
            <Card className="soil-texture">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-accent" />
                  Soil Nutrients (NPK)
                </CardTitle>
                <CardDescription>Current nutrient levels from your soil sensor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 rounded-xl bg-success/5 border border-success/20">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-muted-foreground">Nitrogen (N)</span>
                      <span className={`text-sm font-medium ${getNutrientStatus(soilData.nitrogen).color}`}>
                        {getNutrientStatus(soilData.nitrogen).status}
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-foreground mb-2">{soilData.nitrogen}%</p>
                    <Progress value={soilData.nitrogen} className="h-2" />
                  </div>
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-muted-foreground">Phosphorus (P)</span>
                      <span className={`text-sm font-medium ${getNutrientStatus(soilData.phosphorus).color}`}>
                        {getNutrientStatus(soilData.phosphorus).status}
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-foreground mb-2">{soilData.phosphorus}%</p>
                    <Progress value={soilData.phosphorus} className="h-2" />
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/20">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-muted-foreground">Potassium (K)</span>
                      <span className={`text-sm font-medium ${getNutrientStatus(soilData.potassium).color}`}>
                        {getNutrientStatus(soilData.potassium).status}
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-foreground mb-2">{soilData.potassium}%</p>
                    <Progress value={soilData.potassium} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Environmental Readings */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Droplets className="w-8 h-8 text-accent mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{soilData.humidity}%</p>
                  <p className="text-xs text-muted-foreground">Humidity</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Thermometer className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{soilData.temperature}°C</p>
                  <p className="text-xs text-muted-foreground">Temperature</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Droplets className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{soilData.moistureLevel}%</p>
                  <p className="text-xs text-muted-foreground">Moisture Level</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Wind className="w-8 h-8 text-success mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{soilData.windSpeed} km/h</p>
                  <p className="text-xs text-muted-foreground">Wind Speed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <FlaskConical className="w-8 h-8 text-warning mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{soilData.ph}</p>
                  <p className="text-xs text-muted-foreground">Soil pH</p>
                </CardContent>
              </Card>
            </div>

            {/* AI Model Predictions */}
            <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Model Predictions
                </CardTitle>
                <CardDescription>AI-powered analysis based on your soil data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-3">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted" />
                        <circle 
                          cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" 
                          strokeDasharray={`${predictions.soilHealth * 2.51} 251`}
                          className="text-success"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-foreground">
                        {predictions.soilHealth}
                      </span>
                    </div>
                    <p className="font-medium text-foreground">Soil Health Score</p>
                  </div>
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-3">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted" />
                        <circle 
                          cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" 
                          strokeDasharray={`${predictions.yieldPotential * 2.51} 251`}
                          className="text-primary"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-foreground">
                        {predictions.yieldPotential}
                      </span>
                    </div>
                    <p className="font-medium text-foreground">Yield Potential</p>
                  </div>
                  <div className="text-center">
                    <div className={`w-24 h-24 mx-auto mb-3 rounded-full flex items-center justify-center ${
                      predictions.riskLevel === 'low' ? 'bg-success/20 text-success' :
                      predictions.riskLevel === 'medium' ? 'bg-warning/20 text-warning' : 'bg-destructive/20 text-destructive'
                    }`}>
                      <span className="text-2xl font-bold capitalize">{predictions.riskLevel}</span>
                    </div>
                    <p className="font-medium text-foreground">Risk Level</p>
                  </div>
                </div>
                <div className="bg-card rounded-lg p-4 border">
                  <h4 className="font-medium text-foreground mb-3">AI Recommendations</h4>
                  <ul className="space-y-2">
                    {predictions.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Crop Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-success" />
                  Crop Recommendations
                </CardTitle>
                <CardDescription>Best crops for your soil conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cropRecommendations.map((crop, idx) => (
                    <div key={idx} className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground">{crop.name}</span>
                        <span className={`text-sm font-bold ${
                          crop.suitability >= 85 ? 'text-success' : 
                          crop.suitability >= 70 ? 'text-warning' : 'text-destructive'
                        }`}>{crop.suitability}%</span>
                      </div>
                      <Progress value={crop.suitability} className="h-2 mb-2" />
                      <div className="text-xs text-muted-foreground">
                        <p>Season: {crop.season}</p>
                        <p>Duration: {crop.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Farming Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-accent" />
                  Comprehensive Farming Guide
                </CardTitle>
                <CardDescription>Step-by-step guidance for optimal crop production</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="space-y-2">
                  {cropGuide.map((guide) => {
                    const Icon = guide.icon;
                    return (
                      <AccordionItem key={guide.id} value={guide.id} className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <span className="font-medium text-foreground">{guide.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 text-muted-foreground">
                          {guide.content}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SoilTesting;
