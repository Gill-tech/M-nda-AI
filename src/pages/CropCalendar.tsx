import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Calendar,
  Sprout,
  Sun,
  CloudRain,
  Droplets,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Scissors,
  Package
} from "lucide-react";

interface CropEvent {
  id: string;
  crop: string;
  activity: string;
  date: string;
  type: "planting" | "watering" | "fertilizing" | "harvesting" | "spraying";
  description: string;
}

const CropCalendar = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedCrop, setSelectedCrop] = useState<string>("all");

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const crops = [
    { value: "all", label: "All Crops" },
    { value: "maize", label: "Maize" },
    { value: "beans", label: "Beans" },
    { value: "tomatoes", label: "Tomatoes" },
    { value: "potatoes", label: "Potatoes" },
    { value: "cabbage", label: "Cabbage" },
    { value: "onions", label: "Onions" },
    { value: "wheat", label: "Wheat" }
  ];

  // Kenya farming seasons
  const seasons = [
    { name: "Long Rains", months: [2, 3, 4, 5], description: "March - June: Main planting season" },
    { name: "Cool Dry", months: [6, 7], description: "July - August: Harvesting & land prep" },
    { name: "Short Rains", months: [9, 10, 11], description: "October - December: Second planting" },
    { name: "Hot Dry", months: [0, 1], description: "January - February: Irrigation crops" }
  ];

  const getCurrentSeason = () => {
    return seasons.find(s => s.months.includes(selectedMonth)) || seasons[0];
  };

  // Sample crop calendar events
  const cropEvents: CropEvent[] = [
    // Maize events
    { id: "1", crop: "maize", activity: "Land Preparation", date: "2024-03-01", type: "planting", description: "Clear field, plough and harrow. Test soil pH." },
    { id: "2", crop: "maize", activity: "Planting", date: "2024-03-15", type: "planting", description: "Plant at onset of rains. Space 75cm x 25cm." },
    { id: "3", crop: "maize", activity: "First Weeding", date: "2024-04-01", type: "watering", description: "Remove weeds when maize is knee-high." },
    { id: "4", crop: "maize", activity: "Top Dressing", date: "2024-04-15", type: "fertilizing", description: "Apply CAN at 50kg/acre during knee-high stage." },
    { id: "5", crop: "maize", activity: "Pest Scouting", date: "2024-05-01", type: "spraying", description: "Check for fall armyworm and stalk borers." },
    { id: "6", crop: "maize", activity: "Harvesting", date: "2024-07-15", type: "harvesting", description: "Harvest when husks turn brown, 20-25% moisture." },
    
    // Beans events
    { id: "7", crop: "beans", activity: "Planting", date: "2024-03-20", type: "planting", description: "Plant after maize. Space 45cm x 15cm." },
    { id: "8", crop: "beans", activity: "Weeding", date: "2024-04-10", type: "watering", description: "Hand weed to avoid root damage." },
    { id: "9", crop: "beans", activity: "Flowering Check", date: "2024-05-01", type: "spraying", description: "Check for bean rust and aphids." },
    { id: "10", crop: "beans", activity: "Harvesting", date: "2024-06-01", type: "harvesting", description: "Harvest when pods turn yellow." },
    
    // Tomatoes events
    { id: "11", crop: "tomatoes", activity: "Nursery Sowing", date: "2024-02-15", type: "planting", description: "Sow in nursery beds, transplant after 4-6 weeks." },
    { id: "12", crop: "tomatoes", activity: "Transplanting", date: "2024-03-25", type: "planting", description: "Transplant seedlings at 60cm x 45cm spacing." },
    { id: "13", crop: "tomatoes", activity: "Staking", date: "2024-04-15", type: "watering", description: "Stake plants to support growth." },
    { id: "14", crop: "tomatoes", activity: "Spraying", date: "2024-05-01", type: "spraying", description: "Apply fungicide for blight prevention." },
    { id: "15", crop: "tomatoes", activity: "First Harvest", date: "2024-05-20", type: "harvesting", description: "Pick when fruits turn red. Harvest every 3-4 days." },

    // Potatoes events
    { id: "16", crop: "potatoes", activity: "Land Preparation", date: "2024-02-20", type: "planting", description: "Deep ploughing, add manure 2 weeks before planting." },
    { id: "17", crop: "potatoes", activity: "Planting", date: "2024-03-10", type: "planting", description: "Plant certified seed potatoes 75cm x 30cm." },
    { id: "18", crop: "potatoes", activity: "Earthing Up", date: "2024-04-20", type: "watering", description: "Hill soil around plants when 15-20cm tall." },
    { id: "19", crop: "potatoes", activity: "Harvesting", date: "2024-06-20", type: "harvesting", description: "Harvest when foliage dies down, 90-120 days." },

    // Cabbage events
    { id: "20", crop: "cabbage", activity: "Nursery Sowing", date: "2024-07-01", type: "planting", description: "Sow in nursery for cool season planting." },
    { id: "21", crop: "cabbage", activity: "Transplanting", date: "2024-08-01", type: "planting", description: "Transplant at 60cm x 45cm after 4-6 weeks." },
    { id: "22", crop: "cabbage", activity: "Fertilizer Application", date: "2024-08-20", type: "fertilizing", description: "Apply NPK fertilizer for head formation." },
    { id: "23", crop: "cabbage", activity: "Harvesting", date: "2024-10-15", type: "harvesting", description: "Harvest when heads are firm and compact." }
  ];

  const getFilteredEvents = () => {
    return cropEvents.filter(event => {
      const eventDate = new Date(event.date);
      const matchesMonth = eventDate.getMonth() === selectedMonth;
      const matchesCrop = selectedCrop === "all" || event.crop === selectedCrop;
      return matchesMonth && matchesCrop;
    });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "planting": return <Sprout className="w-4 h-4" />;
      case "watering": return <Droplets className="w-4 h-4" />;
      case "fertilizing": return <Leaf className="w-4 h-4" />;
      case "harvesting": return <Package className="w-4 h-4" />;
      case "spraying": return <Scissors className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "planting": return "bg-success/10 text-success border-success/20";
      case "watering": return "bg-accent/10 text-accent border-accent/20";
      case "fertilizing": return "bg-warning/10 text-warning border-warning/20";
      case "harvesting": return "bg-secondary/10 text-secondary border-secondary/20";
      case "spraying": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentSeason = getCurrentSeason();
  const filteredEvents = getFilteredEvents();
  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              Crop Calendar
            </h1>
            <p className="text-muted-foreground mt-1">
              Plan your farming activities throughout the year
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
              <SelectTrigger className="w-[180px] bg-card">
                <SelectValue placeholder="Select crop" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {crops.map((crop) => (
                  <SelectItem key={crop.value} value={crop.value}>
                    {crop.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Current Season Banner */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                {currentSeason.months.includes(selectedMonth) && currentSeason.name === "Long Rains" ? (
                  <CloudRain className="w-10 h-10 text-accent" />
                ) : currentSeason.name === "Short Rains" ? (
                  <CloudRain className="w-10 h-10 text-accent" />
                ) : currentSeason.name.includes("Dry") ? (
                  <Sun className="w-10 h-10 text-secondary" />
                ) : (
                  <Sprout className="w-10 h-10 text-success" />
                )}
                <div>
                  <h3 className="font-semibold text-foreground">{currentSeason.name} Season</h3>
                  <p className="text-sm text-muted-foreground">{currentSeason.description}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="icon" onClick={prevMonth}>
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <CardTitle className="text-xl">
                    {months[selectedMonth]} {selectedYear}
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={nextMonth}>
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells for days before the first of the month */}
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square p-1" />
                  ))}
                  
                  {/* Days of the month */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayEvents = cropEvents.filter(e => e.date === dateStr && (selectedCrop === "all" || e.crop === selectedCrop));
                    const isToday = new Date().getDate() === day && new Date().getMonth() === selectedMonth && new Date().getFullYear() === selectedYear;

                    return (
                      <div 
                        key={day} 
                        className={`aspect-square p-1 rounded-lg border ${
                          isToday ? 'border-primary bg-primary/5' : 'border-transparent hover:border-border hover:bg-muted/50'
                        } transition-colors`}
                      >
                        <div className="text-xs font-medium mb-1">{day}</div>
                        <div className="space-y-0.5">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div 
                              key={event.id} 
                              className={`text-[10px] px-1 rounded truncate ${getEventColor(event.type)}`}
                              title={event.activity}
                            >
                              {event.activity}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-[10px] text-muted-foreground">
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Events List */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">This Month's Activities</CardTitle>
                <CardDescription>{filteredEvents.length} scheduled activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => (
                    <div 
                      key={event.id} 
                      className={`p-3 rounded-lg border ${getEventColor(event.type)}`}
                    >
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5">{getEventIcon(event.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{event.activity}</p>
                            <span className="text-xs capitalize bg-background/50 px-2 py-0.5 rounded">{event.crop}</span>
                          </div>
                          <p className="text-xs mt-1 opacity-80">{event.description}</p>
                          <p className="text-xs mt-1 opacity-60">
                            {new Date(event.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No activities scheduled for this month</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Season Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Kenya Farming Seasons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {seasons.map((season) => (
                  <div 
                    key={season.name}
                    className={`p-3 rounded-lg border ${
                      season.months.includes(selectedMonth) 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border'
                    }`}
                  >
                    <p className="font-medium text-sm text-foreground">{season.name}</p>
                    <p className="text-xs text-muted-foreground">{season.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CropCalendar;
