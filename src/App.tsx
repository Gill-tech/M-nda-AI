import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/hooks/useTheme";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import FarmRegistration from "./pages/FarmRegistration";
import Market from "./pages/Market";
import Finance from "./pages/Finance";
import CreditScore from "./pages/CreditScore";
import ClimateAlerts from "./pages/ClimateAlerts";
import FoodStorage from "./pages/FoodStorage";
import SoilTesting from "./pages/SoilTesting";
import LandMapping from "./pages/LandMapping";
import CropCalendar from "./pages/CropCalendar";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/register-farm" element={<FarmRegistration />} />
              <Route path="/market" element={<Market />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/credit-score" element={<CreditScore />} />
              <Route path="/climate-alerts" element={<ClimateAlerts />} />
              <Route path="/food-storage" element={<FoodStorage />} />
              <Route path="/soil-testing" element={<SoilTesting />} />
              <Route path="/land-mapping" element={<LandMapping />} />
              <Route path="/crop-calendar" element={<CropCalendar />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
