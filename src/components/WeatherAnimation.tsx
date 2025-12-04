import { useEffect, useState } from "react";

interface WeatherAnimationProps {
  condition: "rain" | "sunny" | "cloudy" | "storm" | "snow";
  intensity?: "light" | "medium" | "heavy";
}

export const WeatherAnimation = ({ condition, intensity = "medium" }: WeatherAnimationProps) => {
  const [drops, setDrops] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    const dropCount = intensity === "light" ? 30 : intensity === "medium" ? 60 : 100;
    const newDrops = Array.from({ length: dropCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 0.5 + Math.random() * 0.5,
    }));
    setDrops(newDrops);
  }, [intensity]);

  if (condition === "rain" || condition === "storm") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {/* Rain drops */}
        {drops.map((drop) => (
          <div
            key={drop.id}
            className="rain-drop absolute"
            style={{
              left: `${drop.left}%`,
              animationDelay: `${drop.delay}s`,
              animationDuration: `${drop.duration}s`,
            }}
          />
        ))}
        {/* Lightning for storm */}
        {condition === "storm" && (
          <div className="absolute inset-0 lightning-flash" />
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800/30 to-slate-900/40" />
      </div>
    );
  }

  if (condition === "sunny") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {/* Sun rays */}
        <div className="absolute top-0 right-0 w-64 h-64 -translate-y-1/2 translate-x-1/2">
          <div className="sun-glow" />
          <div className="sun-core" />
        </div>
        {/* Light particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="sun-particle"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
        {/* Warm overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/10" />
      </div>
    );
  }

  if (condition === "cloudy") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {/* Floating clouds */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="cloud"
            style={{
              top: `${5 + i * 15}%`,
              animationDelay: `${i * 3}s`,
              opacity: 0.6 + Math.random() * 0.3,
            }}
          />
        ))}
        {/* Cloudy overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-400/10 to-slate-500/20" />
      </div>
    );
  }

  if (condition === "snow") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {/* Snowflakes */}
        {drops.map((drop) => (
          <div
            key={drop.id}
            className="snowflake absolute"
            style={{
              left: `${drop.left}%`,
              animationDelay: `${drop.delay * 2}s`,
              animationDuration: `${3 + drop.duration * 2}s`,
            }}
          />
        ))}
        {/* Cold overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-100/10 to-blue-200/20" />
      </div>
    );
  }

  return null;
};

export default WeatherAnimation;
