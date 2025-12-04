import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageSidebar, SidebarSection } from "@/components/PageSidebar";
import { useAuth } from "@/contexts/AuthContext";
import {
  Package,
  Thermometer,
  Droplets,
  AlertTriangle,
  Plus,
  TrendingDown,
  Clock,
  CheckCircle,
  Warehouse,
  Wheat,
  Apple,
  Carrot,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  Bug,
  Wind,
  Sun,
  Boxes,
  Scale
} from "lucide-react";

interface StorageItem {
  id: string;
  name: string;
  type: "grain" | "vegetable" | "fruit";
  quantity: number;
  unit: string;
  storedDate: string;
  expiryDate: string;
  status: "good" | "warning" | "critical";
  temperature: number;
  humidity: number;
  location: string;
}

const mockStorageItems: StorageItem[] = [
  { id: "1", name: "Maize (Dried)", type: "grain", quantity: 500, unit: "kg", storedDate: "2024-11-15", expiryDate: "2025-05-15", status: "good", temperature: 18, humidity: 12, location: "Silo A" },
  { id: "2", name: "Tomatoes", type: "vegetable", quantity: 50, unit: "kg", storedDate: "2024-11-28", expiryDate: "2024-12-08", status: "warning", temperature: 14, humidity: 85, location: "Cold Store" },
  { id: "3", name: "Beans", type: "grain", quantity: 200, unit: "kg", storedDate: "2024-10-20", expiryDate: "2025-04-20", status: "good", temperature: 17, humidity: 13, location: "Silo B" },
  { id: "4", name: "Mangoes", type: "fruit", quantity: 30, unit: "kg", storedDate: "2024-12-01", expiryDate: "2024-12-10", status: "critical", temperature: 16, humidity: 90, location: "Cold Store" }
];

const FoodStorage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [storageItems] = useState<StorageItem[]>(mockStorageItems);
  const [selectedItem, setSelectedItem] = useState<StorageItem | null>(null);

  // Sidebar sections for Food Storage
  const storageSidebar: SidebarSection[] = [
    {
      id: "temperature-control",
      title: "Temperature Control",
      icon: Thermometer,
      status: "good",
      content: (
        <div className="space-y-3">
          <p><strong>Optimal Storage Temperatures</strong></p>
          <p className="text-xs">Temperature is the most critical factor in post-harvest storage. Wrong temperature = rapid spoilage.</p>
          <div className="mt-3 space-y-2">
            <div className="p-2 bg-secondary/10 rounded border-l-4 border-secondary">
              <p className="text-xs font-medium">Grains (Maize, Beans, Wheat)</p>
              <p className="text-xs">15-20°C | Can store for 6-12 months</p>
              <p className="text-xs text-muted-foreground">Must be dried to less than 13% moisture first</p>
            </div>
            <div className="p-2 bg-success/10 rounded border-l-4 border-success">
              <p className="text-xs font-medium">Vegetables</p>
              <p className="text-xs">10-15°C | Store for 1-4 weeks</p>
              <p className="text-xs text-muted-foreground">Tomatoes: 12-15°C, Cabbage: 0-2°C</p>
            </div>
            <div className="p-2 bg-warning/10 rounded border-l-4 border-warning">
              <p className="text-xs font-medium">Fruits</p>
              <p className="text-xs">8-13°C | Store for 1-3 weeks</p>
              <p className="text-xs text-muted-foreground">Mangoes: 10-13°C, Bananas: 13-15°C</p>
            </div>
            <div className="p-2 bg-accent/10 rounded border-l-4 border-accent">
              <p className="text-xs font-medium">Potatoes & Onions</p>
              <p className="text-xs">4-10°C | Store for 2-6 months</p>
              <p className="text-xs text-muted-foreground">Keep in dark, well-ventilated area</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "humidity-management",
      title: "Humidity Management",
      icon: Droplets,
      status: "warning",
      content: (
        <div className="space-y-3">
          <p><strong>Moisture Control</strong></p>
          <p className="text-xs">High humidity causes mold, rot, and aflatoxin. Low humidity causes shriveling.</p>
          <div className="mt-3 p-2 bg-muted rounded">
            <p className="text-xs font-medium mb-2">Humidity Guidelines:</p>
            <ul className="text-xs space-y-1">
              <li>• <strong>Grains:</strong> 12-14% (very dry)</li>
              <li>• <strong>Vegetables:</strong> 85-95% (high humidity)</li>
              <li>• <strong>Fruits:</strong> 85-90%</li>
              <li>• <strong>Roots/Tubers:</strong> 80-85%</li>
            </ul>
          </div>
          <div className="mt-3 p-2 bg-warning/10 rounded">
            <p className="text-xs font-medium mb-2">Signs of Humidity Problems:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Mold growth (white, green, black spots)</li>
              <li>Musty smell in storage area</li>
              <li>Condensation on walls/containers</li>
              <li>Grain clumping together</li>
            </ul>
          </div>
          <div className="mt-3 p-2 bg-success/10 rounded">
            <p className="text-xs font-medium mb-2">How to Control:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Use desiccants (silica gel) for grains</li>
              <li>Ensure proper ventilation</li>
              <li>Use hermetic bags for long-term storage</li>
              <li>Install humidity sensors</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "pest-protection",
      title: "Pest Protection",
      icon: Bug,
      status: "neutral",
      content: (
        <div className="space-y-3">
          <p><strong>Preventing Storage Pests</strong></p>
          <p className="text-xs">Insects can destroy 20-40% of stored grain if not controlled.</p>
          <div className="mt-3 p-2 bg-destructive/10 rounded">
            <p className="text-xs font-medium mb-2">Common Storage Pests:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li><strong>Weevils:</strong> Attack maize, sorghum, rice</li>
              <li><strong>Grain borers:</strong> Bore holes in grains</li>
              <li><strong>Flour beetles:</strong> Feed on grain dust</li>
              <li><strong>Rodents:</strong> Contaminate and consume</li>
            </ul>
          </div>
          <div className="mt-3 p-2 bg-success/10 rounded">
            <p className="text-xs font-medium mb-2">Prevention Methods:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Clean storage area thoroughly before use</li>
              <li>Use hermetic (airtight) bags</li>
              <li>Apply approved grain protectants (Actellic)</li>
              <li>Use PICS bags (Purdue Improved Crop Storage)</li>
              <li>Solar drying before storage</li>
              <li>Regular inspection every 2 weeks</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "storage-types",
      title: "Storage Options",
      icon: Boxes,
      status: "neutral",
      content: (
        <div className="space-y-3">
          <p><strong>Choosing the Right Storage</strong></p>
          <div className="mt-3 space-y-2">
            <div className="p-2 bg-muted rounded">
              <p className="text-xs font-medium">Traditional Granary</p>
              <p className="text-xs">Cost: Low | Duration: 3-6 months</p>
              <p className="text-xs text-muted-foreground">Best for: Small quantities, short-term</p>
            </div>
            <div className="p-2 bg-primary/10 rounded">
              <p className="text-xs font-medium">Metal Silos</p>
              <p className="text-xs">Cost: KES 15,000-50,000 | Duration: 12+ months</p>
              <p className="text-xs text-muted-foreground">Best for: Large quantities, long-term</p>
            </div>
            <div className="p-2 bg-success/10 rounded">
              <p className="text-xs font-medium">Hermetic Bags (PICS)</p>
              <p className="text-xs">Cost: KES 150-300/bag | Duration: 12 months</p>
              <p className="text-xs text-muted-foreground">Best for: Grain, no chemicals needed</p>
            </div>
            <div className="p-2 bg-accent/10 rounded">
              <p className="text-xs font-medium">Cold Storage</p>
              <p className="text-xs">Cost: KES 5-20/kg/month | Duration: 2-8 weeks</p>
              <p className="text-xs text-muted-foreground">Best for: Perishables, high value produce</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "spoilage-prevention",
      title: "Preventing Spoilage",
      icon: ShieldCheck,
      status: "good",
      content: (
        <div className="space-y-3">
          <p><strong>Reducing Post-Harvest Losses</strong></p>
          <p className="text-xs">Kenya loses 30-40% of food to post-harvest losses. Here's how to prevent it:</p>
          <div className="mt-3 p-2 bg-success/10 rounded">
            <p className="text-xs font-medium mb-2">Best Practices:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Harvest at right maturity (not too early/late)</li>
              <li>Handle carefully to avoid bruising</li>
              <li>Sort and grade before storage</li>
              <li>Dry grains properly (below 13% moisture)</li>
              <li>Store in clean, disinfected containers</li>
              <li>First In, First Out (FIFO) rotation</li>
              <li>Monitor regularly with sensors</li>
            </ul>
          </div>
          <div className="mt-3 p-2 bg-warning/10 rounded">
            <p className="text-xs font-medium mb-2">Signs of Spoilage:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Unusual smell (sour, musty, fermented)</li>
              <li>Color changes (darkening, spots)</li>
              <li>Soft or mushy texture</li>
              <li>Visible mold or insect damage</li>
              <li>Heating in grain stores</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "selling-timing",
      title: "When to Sell",
      icon: Clock,
      status: "warning",
      content: (
        <div className="space-y-3">
          <p><strong>Timing Your Sales</strong></p>
          <p className="text-xs">Don't let produce spoil waiting for better prices. Know when to sell!</p>
          <div className="mt-3 space-y-2">
            <div className="p-2 bg-destructive/10 rounded">
              <p className="text-xs font-medium text-destructive">Sell Immediately (1-3 days)</p>
              <ul className="text-xs mt-1 list-disc list-inside">
                <li>Ripe tomatoes, mangoes, avocados</li>
                <li>Leafy vegetables (kale, spinach)</li>
                <li>Fresh milk, eggs</li>
              </ul>
            </div>
            <div className="p-2 bg-warning/10 rounded">
              <p className="text-xs font-medium text-warning">Sell Within 1-2 Weeks</p>
              <ul className="text-xs mt-1 list-disc list-inside">
                <li>Cabbage, carrots, peppers</li>
                <li>Semi-ripe fruits</li>
                <li>Fresh beans</li>
              </ul>
            </div>
            <div className="p-2 bg-success/10 rounded">
              <p className="text-xs font-medium text-success">Can Store 3+ Months</p>
              <ul className="text-xs mt-1 list-disc list-inside">
                <li>Dried maize, beans, wheat</li>
                <li>Potatoes, onions (if cured)</li>
                <li>Honey, dried fruits</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Tip: Check our Market page for current prices before deciding!</p>
        </div>
      )
    }
  ];

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "bg-success/10 text-success border-success/20";
      case "warning": return "bg-warning/10 text-warning border-warning/20";
      case "critical": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "grain": return Wheat;
      case "fruit": return Apple;
      case "vegetable": return Carrot;
      default: return Package;
    }
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const totalQuantity = storageItems.reduce((sum, item) => sum + item.quantity, 0);
  const criticalItems = storageItems.filter(item => item.status === "critical").length;
  const warningItems = storageItems.filter(item => item.status === "warning").length;

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
              Food Storage & Waste Reduction
            </h1>
            <p className="text-muted-foreground mt-1">
              Track storage conditions, reduce spoilage, and optimize sales timing
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync Sensors
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="xl:col-span-1 order-2 xl:order-1">
            <PageSidebar title="Storage Guide" sections={storageSidebar} />
          </div>

          {/* Main Content */}
          <div className="xl:col-span-3 order-1 xl:order-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="stat-card">
                <div className="text-sm text-muted-foreground mb-2">Total Stored</div>
                <div className="text-3xl font-display font-bold text-foreground">{totalQuantity.toLocaleString()} kg</div>
                <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                  <Warehouse className="w-4 h-4" />
                  <span>Across {storageItems.length} items</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="text-sm text-muted-foreground mb-2">Good Condition</div>
                <div className="text-3xl font-display font-bold text-success">{storageItems.filter(i => i.status === "good").length}</div>
                <div className="flex items-center gap-1 mt-2 text-sm text-success">
                  <CheckCircle className="w-4 h-4" />
                  <span>Optimal storage</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="text-sm text-muted-foreground mb-2">Needs Attention</div>
                <div className="text-3xl font-display font-bold text-warning">{warningItems}</div>
                <div className="flex items-center gap-1 mt-2 text-sm text-warning">
                  <Clock className="w-4 h-4" />
                  <span>Sell soon</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="text-sm text-muted-foreground mb-2">Critical</div>
                <div className="text-3xl font-display font-bold text-destructive">{criticalItems}</div>
                <div className="flex items-center gap-1 mt-2 text-sm text-destructive">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Immediate action</span>
                </div>
              </div>
            </div>

            {/* Storage Grid */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Storage Inventory</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {storageItems.map((item) => {
                  const ItemIcon = getTypeIcon(item.type);
                  const daysLeft = getDaysUntilExpiry(item.expiryDate);
                  return (
                    <div
                      key={item.id}
                      className={`p-5 rounded-xl border cursor-pointer transition-all hover:shadow-md ${getStatusColor(item.status)}`}
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center">
                            <ItemIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.location}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Quantity</p>
                          <p className="font-medium text-foreground">{item.quantity} {item.unit}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Temperature</p>
                          <p className="font-medium text-foreground flex items-center gap-1">
                            <Thermometer className="w-3 h-3" />
                            {item.temperature}°C
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Humidity</p>
                          <p className="font-medium text-foreground flex items-center gap-1">
                            <Droplets className="w-3 h-3" />
                            {item.humidity}%
                          </p>
                        </div>
                      </div>

                      <div className={`flex items-center justify-between p-3 rounded-lg ${
                        daysLeft <= 5 ? 'bg-destructive/10' : daysLeft <= 14 ? 'bg-warning/10' : 'bg-success/10'
                      }`}>
                        <span className="text-sm font-medium">
                          {daysLeft <= 0 ? 'Expired!' : `${daysLeft} days until expiry`}
                        </span>
                        {daysLeft <= 14 && (
                          <Button size="sm" variant="ghost" className="h-7 text-xs">
                            Find Buyer
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Recommendations */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">AI Storage Recommendations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Urgent: Sell Mangoes Today</h3>
                      <p className="text-sm text-muted-foreground">
                        High humidity and temperature are accelerating ripening. Best buyer match: Nairobi Fruits Ltd (KES 85/kg).
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
                  <div className="flex items-start gap-3">
                    <TrendingDown className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Tomatoes Price Peak</h3>
                      <p className="text-sm text-muted-foreground">
                        Prices expected to drop 15% next week. Sell within 3 days for optimal returns.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Waste Prevention Stats */}
            <Card className="p-6 bg-gradient-to-br from-success/10 to-primary/10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-2">Waste Prevention Impact</h2>
                  <p className="text-muted-foreground">
                    This month, you've prevented potential spoilage through optimized storage and timely sales.
                  </p>
                </div>
                <div className="flex gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-display font-bold text-success">87%</div>
                    <div className="text-sm text-muted-foreground">Waste Reduced</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-display font-bold text-primary">KES 12K</div>
                    <div className="text-sm text-muted-foreground">Saved</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Item Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg p-6 rounded-2xl bg-card border border-border shadow-xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getStatusColor(selectedItem.status)}`}>
                    {(() => {
                      const Icon = getTypeIcon(selectedItem.type);
                      return <Icon className="w-6 h-6" />;
                    })()}
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">{selectedItem.name}</h2>
                    <p className="text-sm text-muted-foreground">{selectedItem.location}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedItem(null)}>✕</Button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Quantity</p>
                  <p className="font-semibold text-foreground">{selectedItem.quantity} {selectedItem.unit}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Stored Since</p>
                  <p className="font-semibold text-foreground">{new Date(selectedItem.storedDate).toLocaleDateString("en-KE")}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Temperature</p>
                  <p className="font-semibold text-foreground">{selectedItem.temperature}°C</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Humidity</p>
                  <p className="font-semibold text-foreground">{selectedItem.humidity}%</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button className="flex-1" onClick={() => navigate("/market")}>
                  Find Buyer
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" onClick={() => setSelectedItem(null)}>Close</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FoodStorage;
