import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageSidebar, SidebarSection } from "@/components/PageSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { 
  Map, 
  Layers, 
  MapPin,
  Sprout,
  Droplets,
  Sun,
  Loader2,
  Eye,
  Grid3X3,
  Mountain,
  Satellite,
  Ruler,
  TreePine,
  Wheat,
  CloudRain,
  Thermometer
} from "lucide-react";

interface FarmSection {
  id: string;
  name: string;
  area: number;
  soilType: string;
  recommendedCrop: string;
  status: string;
  coordinates: { lat: number; lng: number }[];
}

const LandMapping = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [selectedSection, setSelectedSection] = useState<FarmSection | null>(null);
  const [farmData, setFarmData] = useState<any>(null);
  const [mapView, setMapView] = useState<"satellite" | "terrain">("satellite");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const [farmSections, setFarmSections] = useState<FarmSection[]>([
    {
      id: "section-1",
      name: "North Field",
      area: 2.5,
      soilType: "Loamy",
      recommendedCrop: "Maize",
      status: "Planted",
      coordinates: [
        { lat: -1.2921, lng: 36.8219 },
        { lat: -1.2901, lng: 36.8239 },
        { lat: -1.2881, lng: 36.8219 },
        { lat: -1.2901, lng: 36.8199 },
      ]
    },
    {
      id: "section-2",
      name: "South Field",
      area: 1.8,
      soilType: "Clay",
      recommendedCrop: "Rice",
      status: "Ready for planting",
      coordinates: [
        { lat: -1.2941, lng: 36.8219 },
        { lat: -1.2921, lng: 36.8239 },
        { lat: -1.2901, lng: 36.8219 },
        { lat: -1.2921, lng: 36.8199 },
      ]
    },
    {
      id: "section-3",
      name: "East Garden",
      area: 0.8,
      soilType: "Sandy Loam",
      recommendedCrop: "Vegetables",
      status: "Harvesting",
      coordinates: [
        { lat: -1.2921, lng: 36.8259 },
        { lat: -1.2901, lng: 36.8279 },
        { lat: -1.2881, lng: 36.8259 },
        { lat: -1.2901, lng: 36.8239 },
      ]
    },
    {
      id: "section-4",
      name: "West Pasture",
      area: 3.2,
      soilType: "Silty",
      recommendedCrop: "Fodder Crops",
      status: "Grazing",
      coordinates: [
        { lat: -1.2921, lng: 36.8179 },
        { lat: -1.2901, lng: 36.8199 },
        { lat: -1.2881, lng: 36.8179 },
        { lat: -1.2901, lng: 36.8159 },
      ]
    }
  ]);

  // Define tile layers
  const satelliteLayer = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution: "Tiles © Esri",
      maxZoom: 19,
    }
  );

  const terrainLayer = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    {
      attribution: "Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap",
      maxZoom: 17,
    }
  );

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchFarmData = async () => {
      if (user) {
        const { data } = await supabase
          .from('farms')
          .select('*')
          .eq('user_id', user.id)
          .limit(1);
        if (data && data.length > 0) {
          setFarmData(data[0]);
        }
      }
    };
    fetchFarmData();
  }, [user]);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // Default to Nairobi if geolocation fails
          setUserLocation({ lat: -1.2921, lng: 36.8219 });
        }
      );
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || !userLocation) return;

    // Cleanup existing map
    if (mapRef.current) {
      mapRef.current.remove();
    }

    // Create map
    const map = L.map(mapContainerRef.current, {
      center: [farmData?.latitude || userLocation.lat, farmData?.longitude || userLocation.lng],
      zoom: 15,
      zoomControl: true,
    });

    // Add initial layer based on current view
    if (mapView === "satellite") {
      satelliteLayer.addTo(map);
    } else {
      terrainLayer.addTo(map);
    }

    // Add farm sections as polygons
    farmSections.forEach((section) => {
      const latLngs = section.coordinates.map(c => [c.lat, c.lng] as [number, number]);
      const polygon = L.polygon(latLngs, {
        color: getSoilTypeMapColor(section.soilType),
        fillColor: getSoilTypeMapColor(section.soilType),
        fillOpacity: 0.4,
        weight: 2,
      }).addTo(map);

      polygon.bindPopup(`
        <div style="text-align: center;">
          <strong>${section.name}</strong><br/>
          <span>Area: ${section.area} ha</span><br/>
          <span>Soil: ${section.soilType}</span><br/>
          <span>Crop: ${section.recommendedCrop}</span><br/>
          <span>Status: ${section.status}</span>
        </div>
      `);

      polygon.on('click', () => {
        setSelectedSection(section);
      });
    });

    // Add user location marker
    const userIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: #22c55e; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .addTo(map)
      .bindPopup("Your Location");

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [userLocation, farmData]);

  // Handle map view change
  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapRef.current?.removeLayer(layer);
      }
    });

    if (mapView === "satellite") {
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { attribution: "Tiles © Esri", maxZoom: 19 }
      ).addTo(mapRef.current);
    } else {
      L.tileLayer(
        "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        { attribution: "Map data: © OpenStreetMap, SRTM | Style: © OpenTopoMap", maxZoom: 17 }
      ).addTo(mapRef.current);
    }
  }, [mapView]);

  const handleMapViewChange = (view: "satellite" | "terrain") => {
    setMapView(view);
    toast.success(`Map view changed to ${view}`);
  };

  const getSoilTypeMapColor = (soilType: string) => {
    switch (soilType.toLowerCase()) {
      case 'loamy': return '#22c55e';
      case 'clay': return '#f59e0b';
      case 'sandy loam': return '#8b5cf6';
      case 'silty': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  // Sidebar sections for Land Mapping
  const landMappingSidebar: SidebarSection[] = [
    {
      id: "total-area",
      title: "Total Farm Area",
      icon: Ruler,
      value: `${farmSections.reduce((acc, s) => acc + s.area, 0).toFixed(1)} Hectares`,
      status: "good",
      content: (
        <div className="space-y-3">
          <p>Your total farm area encompasses {farmSections.reduce((acc, s) => acc + s.area, 0).toFixed(1)} hectares divided into {farmSections.length} distinct sections.</p>
          <div className="space-y-2 mt-3">
            {farmSections.map(section => (
              <div key={section.id} className="flex justify-between text-xs bg-muted/50 p-2 rounded">
                <span>{section.name}</span>
                <span className="font-medium">{section.area} ha</span>
              </div>
            ))}
          </div>
          <p className="text-xs mt-3"><strong>Tip:</strong> Optimal farm size for mixed farming in Kenya is 2-5 hectares for efficient management and diversification.</p>
        </div>
      )
    },
    {
      id: "soil-types",
      title: "Soil Types Distribution",
      icon: Mountain,
      status: "neutral",
      content: (
        <div className="space-y-3">
          <p>Your farm has multiple soil types, each suited for different crops:</p>
          <div className="space-y-3 mt-3">
            <div className="p-2 bg-success/10 rounded border-l-4 border-success">
              <p className="font-medium text-success">Loamy Soil (North Field)</p>
              <p className="text-xs mt-1">Ideal for most crops. Rich in nutrients, good drainage, and water retention. Best for: Maize, vegetables, fruits.</p>
            </div>
            <div className="p-2 bg-warning/10 rounded border-l-4 border-warning">
              <p className="font-medium text-warning">Clay Soil (South Field)</p>
              <p className="text-xs mt-1">High water retention, can become waterlogged. Best for: Rice, cabbage, broccoli. Add organic matter to improve drainage.</p>
            </div>
            <div className="p-2 bg-secondary/10 rounded border-l-4 border-secondary">
              <p className="font-medium text-secondary">Sandy Loam (East Garden)</p>
              <p className="text-xs mt-1">Good drainage, warms quickly. Best for: Root vegetables, tomatoes, peppers. May need more frequent watering.</p>
            </div>
            <div className="p-2 bg-primary/10 rounded border-l-4 border-primary">
              <p className="font-medium text-primary">Silty Soil (West Pasture)</p>
              <p className="text-xs mt-1">Fertile and holds moisture well. Best for: Grass, fodder crops, shrubs. Excellent for pastureland.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "crop-allocation",
      title: "Recommended Crop Allocation",
      icon: Wheat,
      status: "good",
      content: (
        <div className="space-y-3">
          <p>Based on your soil analysis and current climate conditions, here are the recommended crops for each section:</p>
          <div className="space-y-2 mt-3">
            <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
              <div>
                <p className="font-medium text-sm">North Field → Maize</p>
                <p className="text-xs text-muted-foreground">Expected yield: 4-6 tonnes/ha</p>
              </div>
              <span className="text-success text-xs font-medium">92% Match</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
              <div>
                <p className="font-medium text-sm">South Field → Rice</p>
                <p className="text-xs text-muted-foreground">Expected yield: 3-5 tonnes/ha</p>
              </div>
              <span className="text-success text-xs font-medium">88% Match</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
              <div>
                <p className="font-medium text-sm">East Garden → Vegetables</p>
                <p className="text-xs text-muted-foreground">Expected yield: 15-25 tonnes/ha</p>
              </div>
              <span className="text-success text-xs font-medium">85% Match</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
              <div>
                <p className="font-medium text-sm">West Pasture → Fodder</p>
                <p className="text-xs text-muted-foreground">For livestock grazing</p>
              </div>
              <span className="text-primary text-xs font-medium">Optimal</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "water-sources",
      title: "Irrigation & Water Sources",
      icon: Droplets,
      status: "warning",
      content: (
        <div className="space-y-3">
          <p>Water management is critical for optimal yields. Here's your irrigation status:</p>
          <div className="space-y-2 mt-3">
            <div className="p-2 bg-success/10 rounded">
              <p className="font-medium text-sm">North Field - Drip Irrigation</p>
              <p className="text-xs">Status: Active | Efficiency: 90%</p>
            </div>
            <div className="p-2 bg-warning/10 rounded">
              <p className="font-medium text-sm">South Field - Flood Irrigation</p>
              <p className="text-xs">Status: Active | Efficiency: 60% (Consider upgrading)</p>
            </div>
            <div className="p-2 bg-success/10 rounded">
              <p className="font-medium text-sm">East Garden - Sprinkler System</p>
              <p className="text-xs">Status: Active | Efficiency: 75%</p>
            </div>
            <div className="p-2 bg-muted rounded">
              <p className="font-medium text-sm">West Pasture - Rain-fed</p>
              <p className="text-xs">Natural water sources available</p>
            </div>
          </div>
          <p className="text-xs mt-3"><strong>Recommendation:</strong> Upgrade South Field to drip irrigation to save up to 40% water and increase yields by 20%.</p>
        </div>
      )
    },
    {
      id: "sunlight-exposure",
      title: "Sunlight & Climate Zones",
      icon: Sun,
      status: "good",
      content: (
        <div className="space-y-3">
          <p>Understanding sunlight patterns helps optimize planting schedules and crop placement.</p>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="p-2 bg-secondary/10 rounded text-center">
              <Sun className="w-6 h-6 mx-auto text-secondary" />
              <p className="text-xs font-medium mt-1">Full Sun</p>
              <p className="text-xs text-muted-foreground">North & East</p>
            </div>
            <div className="p-2 bg-primary/10 rounded text-center">
              <CloudRain className="w-6 h-6 mx-auto text-primary" />
              <p className="text-xs font-medium mt-1">Partial Shade</p>
              <p className="text-xs text-muted-foreground">South & West</p>
            </div>
          </div>
          <p className="text-xs mt-3">Average sunlight hours: 6-8 hours/day during growing season. Temperature range: 18-28°C (optimal for most crops).</p>
        </div>
      )
    },
    {
      id: "elevation",
      title: "Elevation & Terrain",
      icon: TreePine,
      status: "neutral",
      content: (
        <div className="space-y-3">
          <p>Your farm's elevation affects which crops thrive and how water flows across the land.</p>
          <div className="space-y-2 mt-3">
            <div className="flex justify-between text-xs">
              <span>Highest Point (North Field)</span>
              <span className="font-medium">1,680m</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Lowest Point (South Field)</span>
              <span className="font-medium">1,650m</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Average Slope</span>
              <span className="font-medium">2-3%</span>
            </div>
          </div>
          <p className="text-xs mt-3"><strong>Note:</strong> Gentle slope is ideal for preventing waterlogging while retaining moisture. Consider contour farming on steeper sections.</p>
        </div>
      )
    }
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const getSoilTypeColor = (soilType: string) => {
    switch (soilType.toLowerCase()) {
      case 'loamy': return 'bg-success/20 text-success border-success/30';
      case 'clay': return 'bg-warning/20 text-warning border-warning/30';
      case 'sandy loam': return 'bg-secondary/20 text-secondary border-secondary/30';
      case 'silty': return 'bg-primary/20 text-primary border-primary/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'planted': return 'bg-success text-success-foreground';
      case 'ready for planting': return 'bg-warning text-warning-foreground';
      case 'harvesting': return 'bg-accent text-accent-foreground';
      case 'grazing': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground flex items-center gap-3">
              <Map className="w-8 h-8 text-primary" />
              Land Mapping
            </h1>
            <p className="text-muted-foreground mt-1">
              Interactive satellite map of your farm boundaries and sections
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Layers className="w-4 h-4 mr-2" />
              Layers
            </Button>
            <Button>
              <MapPin className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </div>
        </div>

        {/* Farm Info Card */}
        {farmData && (
          <Card className="mb-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Farm Name</p>
                  <p className="text-lg font-semibold text-foreground">{farmData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Area</p>
                  <p className="text-lg font-semibold text-foreground">{farmData.size_hectares || '8.3'} Hectares</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="text-lg font-semibold text-foreground">{farmData.location || farmData.region}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sections</p>
                  <p className="text-lg font-semibold text-foreground">{farmSections.length} Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Sidebar with detailed dropdowns */}
          <div className="xl:col-span-1 order-2 xl:order-1">
            <PageSidebar 
              title="Farm Details" 
              sections={landMappingSidebar}
            />
          </div>

          {/* Map Container */}
          <div className="xl:col-span-2 order-1 xl:order-2">
            <Card className="h-[600px] overflow-hidden relative">
              <div ref={mapContainerRef} className="w-full h-full" />
              
              {/* Map controls overlay */}
              <div className="absolute bottom-4 left-4 z-[1000] flex gap-2">
                <Button 
                  size="sm" 
                  variant={mapView === "satellite" ? "secondary" : "outline"}
                  className="shadow-lg bg-background/90 backdrop-blur"
                  onClick={() => handleMapViewChange("satellite")}
                >
                  <Satellite className="w-4 h-4 mr-1" />
                  Satellite
                </Button>
                <Button 
                  size="sm" 
                  variant={mapView === "terrain" ? "secondary" : "outline"}
                  className="shadow-lg bg-background/90 backdrop-blur"
                  onClick={() => handleMapViewChange("terrain")}
                >
                  <Mountain className="w-4 h-4 mr-1" />
                  Terrain
                </Button>
              </div>

              {/* Current View Indicator */}
              <div className="absolute top-4 left-4 z-[1000] bg-background/90 backdrop-blur px-3 py-1.5 rounded-full shadow-lg">
                <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  {mapView === "satellite" ? (
                    <><Satellite className="w-3 h-3" /> Satellite View</>
                  ) : (
                    <><Mountain className="w-3 h-3" /> Terrain View</>
                  )}
                </p>
              </div>

              {/* Legend */}
              <div className="absolute top-4 right-4 z-[1000] bg-background/90 backdrop-blur rounded-lg p-3 shadow-lg">
                <p className="text-xs font-medium text-foreground mb-2">Soil Types</p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-success" />
                    <span className="text-muted-foreground">Loamy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-warning" />
                    <span className="text-muted-foreground">Clay</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-secondary" />
                    <span className="text-muted-foreground">Sandy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-primary" />
                    <span className="text-muted-foreground">Silty</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Section Details */}
          <div className="xl:col-span-1 order-3">
            {selectedSection ? (
              <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-primary" />
                    {selectedSection.name}
                  </CardTitle>
                  <CardDescription>Section Details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Area</p>
                      <p className="font-semibold text-foreground">{selectedSection.area} Hectares</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Soil Type</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getSoilTypeColor(selectedSection.soilType)}`}>
                        {selectedSection.soilType}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Recommended Crop</p>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/20">
                      <Sprout className="w-5 h-5 text-success" />
                      <span className="font-medium text-foreground">{selectedSection.recommendedCrop}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Current Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedSection.status)}`}>
                      {selectedSection.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="text-center p-2 rounded bg-muted/50">
                      <Sun className="w-4 h-4 mx-auto mb-1 text-secondary" />
                      <p className="text-xs text-muted-foreground">Sunlight</p>
                      <p className="text-sm font-medium">Full</p>
                    </div>
                    <div className="text-center p-2 rounded bg-muted/50">
                      <Droplets className="w-4 h-4 mx-auto mb-1 text-accent" />
                      <p className="text-xs text-muted-foreground">Irrigation</p>
                      <p className="text-sm font-medium">Drip</p>
                    </div>
                    <div className="text-center p-2 rounded bg-muted/50">
                      <Mountain className="w-4 h-4 mx-auto mb-1 text-primary" />
                      <p className="text-xs text-muted-foreground">Slope</p>
                      <p className="text-sm font-medium">2%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Click on a section on the map to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LandMapping;
