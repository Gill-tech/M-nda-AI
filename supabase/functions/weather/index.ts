import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lat, lng } = await req.json();
    
    if (!lat || !lng) {
      return new Response(
        JSON.stringify({ error: "Latitude and longitude are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const OPENWEATHER_API_KEY = Deno.env.get("OPENWEATHER_API_KEY");
    
    if (!OPENWEATHER_API_KEY) {
      // Return mock data if no API key is configured
      const mockWeatherData = {
        temperature: Math.round(20 + Math.random() * 10),
        humidity: Math.round(50 + Math.random() * 30),
        description: ["Partly cloudy", "Sunny", "Scattered clouds", "Light rain"][Math.floor(Math.random() * 4)],
        windSpeed: Math.round(5 + Math.random() * 15),
        icon: "02d",
        location: "Your Location",
        forecast: [
          { day: "Today", high: 28, low: 18, description: "Sunny", icon: "01d" },
          { day: "Tomorrow", high: 26, low: 17, description: "Cloudy", icon: "03d" },
          { day: "Day 3", high: 24, low: 16, description: "Rain", icon: "10d" },
          { day: "Day 4", high: 25, low: 15, description: "Sunny", icon: "01d" },
          { day: "Day 5", high: 27, low: 17, description: "Partly cloudy", icon: "02d" },
        ],
        alerts: [],
        sunrise: "06:30",
        sunset: "18:45",
        uvIndex: 6,
        pressure: 1015,
        visibility: 10,
        feelsLike: Math.round(22 + Math.random() * 8),
      };
      
      return new Response(
        JSON.stringify(mockWeatherData),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch current weather
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${OPENWEATHER_API_KEY}`
    );
    const currentData = await currentResponse.json();

    // Fetch 5-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${OPENWEATHER_API_KEY}`
    );
    const forecastData = await forecastResponse.json();

    // Process forecast data to get daily summaries
    const dailyForecast = [];
    const processedDays = new Set();
    
    for (const item of forecastData.list) {
      const date = new Date(item.dt * 1000);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      if (!processedDays.has(dayName) && dailyForecast.length < 5) {
        processedDays.add(dayName);
        dailyForecast.push({
          day: dailyForecast.length === 0 ? "Today" : dayName,
          high: Math.round(item.main.temp_max),
          low: Math.round(item.main.temp_min),
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        });
      }
    }

    const weatherData = {
      temperature: Math.round(currentData.main.temp),
      humidity: currentData.main.humidity,
      description: currentData.weather[0].description,
      windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
      icon: currentData.weather[0].icon,
      location: currentData.name,
      forecast: dailyForecast,
      alerts: [],
      sunrise: new Date(currentData.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      sunset: new Date(currentData.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      uvIndex: 6, // OpenWeather basic API doesn't include UV, would need OneCall API
      pressure: currentData.main.pressure,
      visibility: Math.round(currentData.visibility / 1000),
      feelsLike: Math.round(currentData.main.feels_like),
    };

    return new Response(
      JSON.stringify(weatherData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Weather API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch weather data" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
