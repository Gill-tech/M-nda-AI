import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

// Fix for default marker icons
const defaultIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const marketIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MarketLocation {
  name: string;
  lat: number;
  lng: number;
  price: number;
  trend: "up" | "down";
  change: number;
}

const marketLocations: MarketLocation[] = [
  { name: "Nairobi", lat: -1.2921, lng: 36.8219, price: 55, trend: "up", change: 12 },
  { name: "Mombasa", lat: -4.0435, lng: 39.6682, price: 52, trend: "up", change: 8 },
  { name: "Kisumu", lat: -0.1022, lng: 34.7617, price: 48, trend: "down", change: -3 },
  { name: "Eldoret", lat: 0.5143, lng: 35.2698, price: 50, trend: "up", change: 5 },
  { name: "Nakuru", lat: -0.3031, lng: 36.0800, price: 51, trend: "up", change: 7 },
  { name: "Thika", lat: -1.0334, lng: 37.0692, price: 53, trend: "up", change: 6 },
  { name: "Machakos", lat: -1.5177, lng: 37.2634, price: 49, trend: "up", change: 4 },
  { name: "Nyeri", lat: -0.4197, lng: 36.9553, price: 47, trend: "down", change: -2 },
];

export const MarketMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Default center on Kenya
  const defaultCenter: [number, number] = [-1.2921, 36.8219];

  const getUserLocation = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
        setUserLocation(coords);
        setIsLocating(false);

        // Update map view and marker
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView(coords, 8);
          
          if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng(coords);
          } else {
            userMarkerRef.current = L.marker(coords, { icon: userIcon })
              .addTo(mapInstanceRef.current)
              .bindPopup(`<div class="text-center"><p class="font-semibold">Your Location</p><p class="text-xs">${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}</p></div>`);
          }
        }
      },
      () => {
        setLocationError("Unable to retrieve your location. Please enable location services.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView(defaultCenter, 7);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add market markers
    marketLocations.forEach((market) => {
      const trendColor = market.trend === "up" ? "text-green-600" : "text-red-600";
      const changeSign = market.change > 0 ? "+" : "";
      
      L.marker([market.lat, market.lng], { icon: marketIcon })
        .addTo(map)
        .bindPopup(`
          <div style="min-width: 150px;">
            <p style="font-weight: 600; margin-bottom: 4px;">${market.name} Market</p>
            <p style="font-size: 14px; margin: 2px 0;"><span style="font-weight: 500;">Price:</span> KES ${market.price}/kg</p>
            <p style="font-size: 14px; margin: 2px 0; color: ${market.trend === "up" ? "#16a34a" : "#dc2626"};">
              ${changeSign}${market.change}% this week
            </p>
          </div>
        `);
    });

    // Try to get user location on load
    getUserLocation();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="p-6 rounded-2xl bg-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Market Locations</h2>
          <p className="text-sm text-muted-foreground">
            View markets across Kenya and your current location
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={getUserLocation}
          disabled={isLocating}
        >
          <Navigation className="w-4 h-4 mr-2" />
          {isLocating ? "Locating..." : "My Location"}
        </Button>
      </div>

      {locationError && (
        <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-lg">
          {locationError}
        </div>
      )}

      <div 
        ref={mapRef} 
        className="h-[400px] rounded-xl overflow-hidden border border-border"
        style={{ zIndex: 0 }}
      />

      <div className="mt-4 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500" />
          <span className="text-muted-foreground">Your Location</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500" />
          <span className="text-muted-foreground">Market Locations</span>
        </div>
      </div>
    </div>
  );
};
