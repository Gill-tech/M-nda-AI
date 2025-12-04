import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageSidebar, SidebarSection } from "@/components/PageSidebar";
import { supabase } from "@/integrations/supabase/client";
import farmerCrops from "@/assets/farmer-crops.jpg";
import { 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  Calendar,
  Search,
  Star,
  Truck,
  X,
  Trophy,
  Wheat,
  Loader2,
  DollarSign,
  BarChart3,
  Clock,
  ShoppingCart,
  Users,
  Route,
  Warehouse,
  Scale
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Market {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  distance_km: number;
  road_condition: string;
  market_type: string;
  operating_days: string[];
}

interface MarketPrice {
  id: string;
  market_id: string;
  crop_type: string;
  price_per_kg: number;
  demand_level: string;
}

interface MarketWithPrices extends Market {
  prices: MarketPrice[];
  rating: number;
  buyers: number;
  weather: string;
  trend: "up" | "down";
  change: number;
}

const priceHistory = [
  { week: "W1", maize: 45, beans: 120, wheat: 55 },
  { week: "W2", maize: 47, beans: 118, wheat: 58 },
  { week: "W3", maize: 44, beans: 125, wheat: 56 },
  { week: "W4", maize: 50, beans: 130, wheat: 60 },
  { week: "W5", maize: 52, beans: 128, wheat: 62 },
  { week: "W6", maize: 55, beans: 135, wheat: 65 },
];

const demandForecast = [
  { month: "Jul", demand: 85 },
  { month: "Aug", demand: 90 },
  { month: "Sep", demand: 95 },
  { month: "Oct", demand: 100 },
  { month: "Nov", demand: 88 },
  { month: "Dec", demand: 92 },
];

const Market = () => {
  const [selectedCrop, setSelectedCrop] = useState("Maize");
  const [selectedMarket, setSelectedMarket] = useState<MarketWithPrices | null>(null);
  const [showMarketDetails, setShowMarketDetails] = useState(false);
  const [markets, setMarkets] = useState<MarketWithPrices[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const crops = ["Maize", "Beans", "Tomatoes", "Potatoes", "Cabbage"];

  // Sidebar sections for Market Intelligence
  const marketSidebar: SidebarSection[] = [
    {
      id: "price-trends",
      title: "Price Trends",
      icon: TrendingUp,
      status: "good",
      content: (
        <div className="space-y-3">
          <p><strong>Understanding Market Prices</strong></p>
          <p>Crop prices in Kenya are influenced by multiple factors including seasonality, demand-supply dynamics, and weather conditions.</p>
          <div className="mt-3 p-2 bg-muted rounded">
            <p className="text-xs font-medium mb-2">Current Trends (Dec 2024):</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li><strong>Maize:</strong> Prices rising due to post-harvest period</li>
              <li><strong>Beans:</strong> High demand, limited supply - peak prices</li>
              <li><strong>Tomatoes:</strong> Oversupply causing price drop</li>
              <li><strong>Potatoes:</strong> Stable prices, moderate demand</li>
            </ul>
          </div>
          <div className="mt-3 p-2 bg-success/10 rounded">
            <p className="text-xs font-medium mb-2">Price Forecast (Next 30 Days):</p>
            <ul className="text-xs space-y-1">
              <li>• Maize: Expected to increase 8-12%</li>
              <li>• Beans: Will remain high through January</li>
              <li>• Vegetables: Seasonal dip expected</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "demand-cycles",
      title: "Demand Cycles",
      icon: BarChart3,
      status: "neutral",
      content: (
        <div className="space-y-3">
          <p><strong>Kenya Crop Demand Calendar</strong></p>
          <p>Understanding when demand peaks helps you time your sales for maximum profit.</p>
          <div className="mt-3 space-y-2">
            <div className="p-2 bg-success/10 rounded">
              <p className="text-xs font-medium text-success">High Demand Periods:</p>
              <ul className="text-xs space-y-1 mt-1">
                <li>• <strong>Dec-Jan:</strong> Holiday season - all crops high</li>
                <li>• <strong>March-April:</strong> School opening - beans, maize</li>
                <li>• <strong>August:</strong> Dry season - vegetables premium</li>
              </ul>
            </div>
            <div className="p-2 bg-warning/10 rounded">
              <p className="text-xs font-medium text-warning">Low Demand Periods:</p>
              <ul className="text-xs space-y-1 mt-1">
                <li>• <strong>Feb:</strong> Post-holiday slump</li>
                <li>• <strong>May-June:</strong> Harvest glut - oversupply</li>
                <li>• <strong>November:</strong> Pre-harvest waiting period</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "transport-logistics",
      title: "Transport & Logistics",
      icon: Truck,
      status: "warning",
      content: (
        <div className="space-y-3">
          <p><strong>Getting Your Produce to Market</strong></p>
          <p>Transport costs significantly impact your profit margins. Choose wisely based on distance and produce type.</p>
          <div className="mt-3 p-2 bg-muted rounded">
            <p className="text-xs font-medium mb-2">Transport Options:</p>
            <ul className="text-xs space-y-2">
              <li><strong>Motorbike (Bodaboda):</strong> Best for small quantities (up to 100kg), short distances. Cost: KES 50-200</li>
              <li><strong>Pick-up Truck:</strong> Medium loads (500kg-2 tonnes), good for perishables. Cost: KES 1,500-5,000</li>
              <li><strong>Lorry:</strong> Bulk transport (5+ tonnes), long distances. Cost: KES 5,000-20,000</li>
            </ul>
          </div>
          <div className="mt-3 p-2 bg-primary/10 rounded">
            <p className="text-xs font-medium mb-2">Road Condition Guide:</p>
            <ul className="text-xs space-y-1">
              <li>🟢 <strong>Tarmac:</strong> Fast, low damage risk</li>
              <li>🟡 <strong>Murram:</strong> Moderate speed, some dust</li>
              <li>🔴 <strong>Earth:</strong> Slow, high damage risk for perishables</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "market-types",
      title: "Market Types",
      icon: Warehouse,
      status: "neutral",
      content: (
        <div className="space-y-3">
          <p><strong>Where to Sell Your Produce</strong></p>
          <div className="mt-3 space-y-2">
            <div className="p-2 bg-success/10 rounded border-l-4 border-success">
              <p className="text-xs font-medium">Wholesale Markets</p>
              <p className="text-xs mt-1">Large volume sales at lower per-unit prices. Examples: Wakulima, Marikiti</p>
              <p className="text-xs text-muted-foreground">Best for: Bulk sales, consistent supply</p>
            </div>
            <div className="p-2 bg-primary/10 rounded border-l-4 border-primary">
              <p className="text-xs font-medium">Retail Markets</p>
              <p className="text-xs mt-1">Direct to consumer, higher prices but smaller quantities.</p>
              <p className="text-xs text-muted-foreground">Best for: Premium produce, small farms</p>
            </div>
            <div className="p-2 bg-secondary/10 rounded border-l-4 border-secondary">
              <p className="text-xs font-medium">Aggregation Centers</p>
              <p className="text-xs mt-1">Cooperative collection points. Good prices, reliable buyers.</p>
              <p className="text-xs text-muted-foreground">Best for: Quality graded produce</p>
            </div>
            <div className="p-2 bg-warning/10 rounded border-l-4 border-warning">
              <p className="text-xs font-medium">Farm Gate Sales</p>
              <p className="text-xs mt-1">Buyers come to you. No transport cost but lower prices.</p>
              <p className="text-xs text-muted-foreground">Best for: Remote locations, bulk buyers</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "selling-tips",
      title: "Selling Tips",
      icon: DollarSign,
      status: "good",
      content: (
        <div className="space-y-3">
          <p><strong>Maximize Your Profits</strong></p>
          <div className="mt-3 p-2 bg-success/10 rounded">
            <p className="text-xs font-medium mb-2">✅ Do:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Grade your produce before selling (fetch 15-30% more)</li>
              <li>Sell early morning when prices are highest</li>
              <li>Build relationships with reliable buyers</li>
              <li>Compare prices across 3+ markets before selling</li>
              <li>Consider aggregating with neighbors for bulk deals</li>
            </ul>
          </div>
          <div className="mt-3 p-2 bg-destructive/10 rounded">
            <p className="text-xs font-medium mb-2">❌ Avoid:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Selling during harvest peak (prices lowest)</li>
              <li>Mixing quality grades together</li>
              <li>Using middlemen unnecessarily</li>
              <li>Transporting without proper packaging</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "buyer-network",
      title: "Finding Buyers",
      icon: Users,
      status: "neutral",
      content: (
        <div className="space-y-3">
          <p><strong>Building Your Buyer Network</strong></p>
          <p>Reliable buyers mean consistent income. Here's how to find them:</p>
          <div className="mt-3 space-y-2">
            <div className="p-2 bg-muted rounded">
              <p className="text-xs font-medium">Buyer Types:</p>
              <ul className="text-xs space-y-1 mt-1">
                <li>• <strong>Brokers:</strong> Quick sales, lower prices</li>
                <li>• <strong>Retailers:</strong> Better prices, smaller quantities</li>
                <li>• <strong>Processors:</strong> Contract farming, stable prices</li>
                <li>• <strong>Exporters:</strong> Premium prices, strict quality</li>
                <li>• <strong>Supermarkets:</strong> Best prices, quality certification needed</li>
              </ul>
            </div>
            <div className="p-2 bg-primary/10 rounded">
              <p className="text-xs font-medium">Contact Methods:</p>
              <ul className="text-xs space-y-1 mt-1">
                <li>• Market committee notice boards</li>
                <li>• County agricultural office</li>
                <li>• Farmer WhatsApp groups</li>
                <li>• M-Farm and Digital platforms</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    const fetchMarkets = async () => {
      const { data: marketsData } = await supabase.from('markets').select('*');
      const { data: pricesData } = await supabase.from('market_prices').select('*');

      if (marketsData && pricesData) {
        const enrichedMarkets: MarketWithPrices[] = marketsData.map((market, index) => ({
          ...market,
          prices: pricesData.filter(p => p.market_id === market.id),
          rating: 4.2 + Math.random() * 0.6,
          buyers: 100 + Math.floor(Math.random() * 150),
          weather: ["Sunny, 24°C", "Cloudy, 22°C", "Mild, 26°C", "Cool, 20°C"][index % 4],
          trend: Math.random() > 0.3 ? "up" : "down",
          change: Math.floor(Math.random() * 15) * (Math.random() > 0.3 ? 1 : -1)
        }));
        setMarkets(enrichedMarkets);
      }
      setIsLoading(false);
    };
    fetchMarkets();
  }, []);

  const handleMarketClick = (market: MarketWithPrices) => {
    setSelectedMarket(market);
    setShowMarketDetails(true);
  };

  const getPrice = (market: MarketWithPrices, cropType: string) => {
    const price = market.prices.find(p => p.crop_type === cropType);
    return price ? price.price_per_kg : 0;
  };

  const filteredMarkets = markets.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const rankedMarkets = [...filteredMarkets].sort((a, b) => {
    return getPrice(b, selectedCrop) - getPrice(a, selectedCrop);
  });

  const avgPrice = rankedMarkets.length > 0 
    ? Math.round(rankedMarkets.reduce((acc, m) => acc + getPrice(m, selectedCrop), 0) / rankedMarkets.length)
    : 0;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              Market Intelligence
            </h1>
            <p className="text-muted-foreground mt-1">
              Find the best market for your harvest with real-time prices and buyer information
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search markets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="relative h-48 rounded-2xl overflow-hidden mb-8">
          <img src={farmerCrops} alt="Farmer with crops" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
          <div className="absolute inset-0 p-8 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <Wheat className="w-6 h-6 text-secondary" />
              <span className="text-sm font-medium text-secondary">Best Markets for Your Harvest</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Find buyers offering the highest prices</h2>
            <p className="text-muted-foreground max-w-md">Compare prices across {markets.length} markets, check road conditions, and get real-time weather updates</p>
          </div>
        </div>

        {/* Crop Selector */}
        <div className="flex flex-wrap gap-2 mb-8">
          {crops.map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCrop === crop
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {crop}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="xl:col-span-1 order-2 xl:order-1">
            <PageSidebar title="Market Guide" sections={marketSidebar} />
          </div>

          {/* Main Content */}
          <div className="xl:col-span-3 order-1 xl:order-2 space-y-6">
            {/* Price Overview Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="stat-card">
                <div className="text-sm text-muted-foreground mb-2">Average Price</div>
                <div className="text-3xl font-display font-bold text-foreground">
                  KES {avgPrice}<span className="text-lg font-normal text-muted-foreground">/kg</span>
                </div>
                <div className="flex items-center gap-1 mt-2 text-sm text-success">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12% this week</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="text-sm text-muted-foreground mb-2">Best Market</div>
                <div className="text-3xl font-display font-bold text-foreground">
                  {rankedMarkets[0]?.name.split(' ')[0] || 'N/A'}
                </div>
                <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{rankedMarkets[0]?.distance_km || 0}km away</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="text-sm text-muted-foreground mb-2">Demand Level</div>
                <div className="text-3xl font-display font-bold text-secondary">High</div>
                <div className="flex items-center gap-1 mt-2 text-sm text-success">
                  <TrendingUp className="w-4 h-4" />
                  <span>Peak season</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="text-sm text-muted-foreground mb-2">Markets Available</div>
                <div className="text-3xl font-display font-bold text-foreground">{markets.length}</div>
                <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Across Kenya</span>
                </div>
              </div>
            </div>

            {/* Market Rankings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-secondary" />
                  Market Rankings for {selectedCrop}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {rankedMarkets.map((market, index) => (
                    <div 
                      key={market.id}
                      onClick={() => handleMarketClick(market)}
                      className="flex items-center justify-between p-4 rounded-xl border bg-card hover:border-primary/50 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-amber-700 text-white' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{market.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span>{market.rating.toFixed(1)}</span>
                            <span>•</span>
                            <span>{market.buyers} buyers</span>
                            <span>•</span>
                            <span>{market.distance_km}km</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">KES {getPrice(market, selectedCrop).toFixed(0)}</p>
                        <div className={`inline-flex items-center gap-1 text-sm ${market.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                          {market.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          <span>{market.change > 0 ? '+' : ''}{market.change}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-6">Price Trends (6 Weeks)</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={priceHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                      <Line type="monotone" dataKey="maize" stroke="hsl(152, 45%, 28%)" strokeWidth={3} />
                      <Line type="monotone" dataKey="beans" stroke="hsl(38, 92%, 50%)" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-6">Demand Forecast</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={demandForecast}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                      <Bar dataKey="demand" fill="hsl(152, 45%, 28%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Market Details Dialog */}
        <Dialog open={showMarketDetails} onOpenChange={setShowMarketDetails}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                {selectedMarket?.name}
              </DialogTitle>
            </DialogHeader>
            {selectedMarket && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Distance</p>
                    <p className="font-semibold">{selectedMarket.distance_km} km</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Road Condition</p>
                    <p className="font-semibold text-success">{selectedMarket.road_condition}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Weather</p>
                    <p className="font-semibold">{selectedMarket.weather}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Active Buyers</p>
                    <p className="font-semibold">{selectedMarket.buyers}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Prices at this market:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {crops.slice(0, 3).map(crop => (
                      <div key={crop} className="p-2 rounded bg-primary/10 text-center">
                        <p className="text-xs text-muted-foreground">{crop}</p>
                        <p className="font-bold">KES {getPrice(selectedMarket, crop)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <Button className="w-full" onClick={() => setShowMarketDetails(false)}>
                  <Route className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Market;
