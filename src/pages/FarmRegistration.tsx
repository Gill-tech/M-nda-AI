import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, 
  Hash, 
  ArrowLeft,
  Loader2,
  CheckCircle,
  Wheat,
  Beef,
  TreeDeciduous,
  Search
} from "lucide-react";
import { z } from "zod";

// Kenya county codes for reference
const KENYA_COUNTIES = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo Marakwet", "Embu", "Garissa", 
  "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi", 
  "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu", "Machakos", 
  "Makueni", "Mandera", "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a", 
  "Nairobi", "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri", 
  "Samburu", "Siaya", "Taita Taveta", "Tana River", "Tharaka Nithi", "Trans Nzoia", 
  "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"
];

// Validation schemas
const serialSchema = z.object({
  serialNumber: z.string()
    .trim()
    .min(10, "Serial number must be at least 10 characters (e.g., KE-NKR-2024-0001)")
    .max(20, "Serial number must be less than 20 characters")
    .regex(/^KE-[A-Z]{3}-\d{4}-\d{4}$/i, "Format: KE-XXX-YYYY-NNNN (e.g., KE-NKR-2024-0001)")
});

const manualSchema = z.object({
  name: z.string().trim().min(2, "Farm name must be at least 2 characters").max(100),
  location: z.string().trim().min(2, "Location is required").max(200),
  region: z.string().trim().min(2, "Region is required").max(100),
  sizeHectares: z.number().min(0.01, "Size must be greater than 0").max(100000),
  farmType: z.enum(["crops", "livestock", "mixed"]),
  soilType: z.string().optional(),
  irrigationType: z.string().optional()
});

const FarmRegistration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("serial");
  const [isLoading, setIsLoading] = useState(false);
  const [serialNumber, setSerialNumber] = useState("");
  const [serialError, setSerialError] = useState("");
  const [foundFarm, setFoundFarm] = useState<any>(null);
  
  // Manual form state
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    region: "",
    sizeHectares: "",
    farmType: "mixed" as "crops" | "livestock" | "mixed",
    soilType: "",
    irrigationType: ""
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleSerialLookup = async () => {
    setSerialError("");
    setFoundFarm(null);
    
    const formattedSerial = serialNumber.toUpperCase().trim();
    const validation = serialSchema.safeParse({ serialNumber: formattedSerial });
    if (!validation.success) {
      setSerialError(validation.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    try {
      // First, look up the farm without claiming it
      const { data, error } = await supabase
        .from('farms')
        .select('*')
        .eq('serial_number', formattedSerial)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setSerialError("No farm found with this serial number. Please verify your kit documentation.");
        return;
      }

      if (data.user_id && data.user_id !== user?.id) {
        setSerialError("This farm is already registered to another user.");
        return;
      }

      setFoundFarm(data);
    } catch (err: any) {
      setSerialError(err.message || "An error occurred while looking up the farm.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimFarm = async () => {
    if (!user || !foundFarm) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('claim_farm_by_serial', {
        p_serial_number: foundFarm.serial_number,
        p_user_id: user.id
      });

      if (error) throw error;

      toast({
        title: "Farm registered successfully!",
        description: `Welcome to ${foundFarm.name}. Your farm data has been loaded.`,
      });
      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: "Error claiming farm",
        description: err.message || "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const validation = manualSchema.safeParse({
      ...formData,
      sizeHectares: parseFloat(formData.sizeHectares) || 0
    });

    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.errors.forEach(err => {
        errors[err.path[0]] = err.message;
      });
      setFormErrors(errors);
      return;
    }

    if (!user) {
      toast({ title: "Please log in first", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      // Generate a Kenya-style serial number for manual entry
      const countyCode = formData.location.substring(0, 3).toUpperCase();
      const year = new Date().getFullYear();
      const randomNum = Math.floor(Math.random() * 9000) + 1000;
      const generatedSerial = `KE-${countyCode}-${year}-${randomNum}`;
      
      const { error } = await supabase.from('farms').insert({
        user_id: user.id,
        serial_number: generatedSerial,
        name: formData.name,
        location: formData.location,
        region: formData.region,
        size_hectares: parseFloat(formData.sizeHectares),
        soil_type: formData.soilType || null,
        irrigation_type: formData.irrigationType || null,
        farm_type: formData.farmType,
        is_registered: true,
        registered_at: new Date().toISOString()
      });

      if (error) throw error;

      toast({
        title: "Farm created successfully!",
        description: `Your farm "${formData.name}" has been registered with ID: ${generatedSerial}`,
      });
      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: "Error creating farm",
        description: err.message || "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFarmTypeIcon = (type: string) => {
    switch (type) {
      case 'crops': return <Wheat className="w-5 h-5" />;
      case 'livestock': return <Beef className="w-5 h-5" />;
      default: return <TreeDeciduous className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12">
        {/* Hero Banner */}
        <div className="relative overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/70" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/dashboard")}
              className="mb-4 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground mb-2">
              Register Your Farm
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl">
              Connect your agricultural operation to Múnda AI. Whether you grow crops, 
              raise livestock, or run a mixed farm—start building your risk profile today.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-6 sm:p-8 rounded-2xl">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-muted/50">
                <TabsTrigger value="serial" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Hash className="w-4 h-4" />
                  Kit Serial Number
                </TabsTrigger>
                <TabsTrigger value="manual" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <MapPin className="w-4 h-4" />
                  Manual Registration
                </TabsTrigger>
              </TabsList>

              <TabsContent value="serial" className="space-y-6">
                <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center shrink-0">
                      <Hash className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Have a Climate Smart Agric Kit?</h3>
                      <p className="text-sm text-muted-foreground">
                        Enter the serial number from your kit documentation to automatically load your 
                        pre-registered farm data and start streaming real-time sensor data.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serial" className="text-sm font-medium">Kit Serial Number</Label>
                  <div className="flex gap-2">
                    <Input
                      id="serial"
                      placeholder="KE-NKR-2024-0001"
                      value={serialNumber}
                      onChange={(e) => {
                        setSerialNumber(e.target.value.toUpperCase());
                        setSerialError("");
                        setFoundFarm(null);
                      }}
                      className={`flex-1 font-mono ${serialError ? "border-destructive" : ""}`}
                    />
                    <Button 
                      onClick={handleSerialLookup} 
                      disabled={isLoading || !serialNumber}
                      variant="outline"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Format: KE-XXX-YYYY-NNNN (County code - Year - Number)</p>
                  {serialError && (
                    <p className="text-sm text-destructive">{serialError}</p>
                  )}
                </div>

                {/* Found Farm Preview */}
                {foundFarm && (
                  <div className="p-6 rounded-xl bg-success/5 border border-success/20 space-y-4 animate-fade-in">
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Farm Found!</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Farm Name</p>
                        <p className="font-medium text-foreground">{foundFarm.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Location</p>
                        <p className="font-medium text-foreground">{foundFarm.location}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Size</p>
                        <p className="font-medium text-foreground">{foundFarm.size_hectares} hectares</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Farm Type</p>
                        <div className="flex items-center gap-2">
                          {getFarmTypeIcon(foundFarm.farm_type)}
                          <span className="font-medium text-foreground capitalize">{foundFarm.farm_type}</span>
                        </div>
                      </div>
                      {foundFarm.soil_type && (
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">Soil Type</p>
                          <p className="font-medium text-foreground">{foundFarm.soil_type}</p>
                        </div>
                      )}
                      {foundFarm.irrigation_type && (
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">Irrigation</p>
                          <p className="font-medium text-foreground">{foundFarm.irrigation_type}</p>
                        </div>
                      )}
                    </div>

                    <Button 
                      onClick={handleClaimFarm} 
                      disabled={isLoading}
                      className="w-full btn-hero"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Claim This Farm
                    </Button>
                  </div>
                )}

                {/* Sample Serial Numbers */}
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <p className="text-xs text-muted-foreground mb-2 font-medium">Available test serial numbers:</p>
                  <div className="flex flex-wrap gap-2">
                    {['KE-NKR-2024-0001', 'KE-NYR-2024-0005', 'KE-KJD-2024-0009'].map((serial) => (
                      <button
                        key={serial}
                        onClick={() => setSerialNumber(serial)}
                        className="px-2 py-1 text-xs font-mono bg-background rounded border border-border hover:border-primary hover:text-primary transition-colors"
                      >
                        {serial}
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="manual">
                <form onSubmit={handleManualSubmit} className="space-y-6">
                  {/* Farm Type Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Farm Type *</Label>
                    <RadioGroup
                      value={formData.farmType}
                      onValueChange={(value) => setFormData({ ...formData, farmType: value as any })}
                      className="grid grid-cols-3 gap-3"
                    >
                      <Label
                        htmlFor="crops"
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.farmType === 'crops' 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <RadioGroupItem value="crops" id="crops" className="sr-only" />
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          formData.farmType === 'crops' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                        }`}>
                          <Wheat className="w-6 h-6" />
                        </div>
                        <span className="font-medium text-sm">Crops</span>
                        <span className="text-xs text-muted-foreground text-center">Cereals, vegetables, fruits</span>
                      </Label>

                      <Label
                        htmlFor="livestock"
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.farmType === 'livestock' 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <RadioGroupItem value="livestock" id="livestock" className="sr-only" />
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          formData.farmType === 'livestock' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                        }`}>
                          <Beef className="w-6 h-6" />
                        </div>
                        <span className="font-medium text-sm">Livestock</span>
                        <span className="text-xs text-muted-foreground text-center">Cattle, goats, poultry</span>
                      </Label>

                      <Label
                        htmlFor="mixed"
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.farmType === 'mixed' 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <RadioGroupItem value="mixed" id="mixed" className="sr-only" />
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          formData.farmType === 'mixed' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                        }`}>
                          <TreeDeciduous className="w-6 h-6" />
                        </div>
                        <span className="font-medium text-sm">Mixed</span>
                        <span className="text-xs text-muted-foreground text-center">Both crops & animals</span>
                      </Label>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Farm Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Green Valley Farm"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={formErrors.name ? "border-destructive" : ""}
                    />
                    {formErrors.name && (
                      <p className="text-sm text-destructive">{formErrors.name}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">County *</Label>
                      <Input
                        id="location"
                        placeholder="e.g., Nakuru County"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        list="counties"
                        className={formErrors.location ? "border-destructive" : ""}
                      />
                      <datalist id="counties">
                        {KENYA_COUNTIES.map(county => (
                          <option key={county} value={`${county} County`} />
                        ))}
                      </datalist>
                      {formErrors.location && (
                        <p className="text-sm text-destructive">{formErrors.location}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="region">Region *</Label>
                      <Input
                        id="region"
                        placeholder="e.g., Rift Valley"
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        list="regions"
                        className={formErrors.region ? "border-destructive" : ""}
                      />
                      <datalist id="regions">
                        <option value="Central" />
                        <option value="Coast" />
                        <option value="Eastern" />
                        <option value="Nairobi" />
                        <option value="North Eastern" />
                        <option value="Nyanza" />
                        <option value="Rift Valley" />
                        <option value="Western" />
                      </datalist>
                      {formErrors.region && (
                        <p className="text-sm text-destructive">{formErrors.region}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size">Farm Size (hectares) *</Label>
                    <Input
                      id="size"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 5.5"
                      value={formData.sizeHectares}
                      onChange={(e) => setFormData({ ...formData, sizeHectares: e.target.value })}
                      className={formErrors.sizeHectares ? "border-destructive" : ""}
                    />
                    {formErrors.sizeHectares && (
                      <p className="text-sm text-destructive">{formErrors.sizeHectares}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="soil">Soil Type (optional)</Label>
                      <Input
                        id="soil"
                        placeholder="e.g., Loamy, Clay, Sandy"
                        value={formData.soilType}
                        onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                        list="soils"
                      />
                      <datalist id="soils">
                        <option value="Loamy" />
                        <option value="Clay Loam" />
                        <option value="Sandy Loam" />
                        <option value="Volcanic Loam" />
                        <option value="Red Volcanic" />
                        <option value="Black Cotton" />
                        <option value="Alluvial" />
                        <option value="Nitisol" />
                      </datalist>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="irrigation">Irrigation Type (optional)</Label>
                      <Input
                        id="irrigation"
                        placeholder="e.g., Drip, Sprinkler"
                        value={formData.irrigationType}
                        onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value })}
                        list="irrigation"
                      />
                      <datalist id="irrigation">
                        <option value="Drip Irrigation" />
                        <option value="Sprinkler" />
                        <option value="Center Pivot" />
                        <option value="Furrow" />
                        <option value="Flood" />
                        <option value="Rainfed" />
                        <option value="Borehole" />
                        <option value="None" />
                      </datalist>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full btn-hero"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    Register Farm
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FarmRegistration;