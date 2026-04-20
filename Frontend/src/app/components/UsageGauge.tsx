import { motion } from "motion/react";
import { useTheme } from "../contexts/ThemeContext";

interface UsageGaugeProps {
  value: number; // 0-100 percentage
  currentKw: number;
  maxKw: number;
}

export default function UsageGauge({
  value,
  currentKw,
  maxKw,
}: UsageGaugeProps) {
  const { theme } = useTheme();
  const normalizedValue = Math.min(100, Math.max(0, value));
  // Convert percentage to degrees (180 degrees for half circle)
  // -90 degrees = left end (0%), 0 degrees = top (50%), 90 degrees = right end (100%)
  const rotation = (normalizedValue / 100) * 180 - 90;

  // Determine color based on usage level
  const getColor = () => {
    if (normalizedValue < 50) return "#10b981"; // green
    if (normalizedValue < 75) return "#eab308"; // yellow
    return "#ef4444"; // red
  };

  // Needle and center dot colors adapt to theme
  const needleColor = theme === "dark" ? "#e5e7eb" : "#1f2937"; // light gray in dark mode, dark gray in light mode
  const backgroundArcColor = theme === "dark" ? "#374151" : "#e5e7eb"; // darker in dark mode

  return (
    <div className="relative w-full max-w-xs mx-auto">
      {/* Semi-circle gauge background */}
      <div className="relative flex items-center justify-center" style={{ paddingBottom: "50%" }}>
        <svg
          viewBox="0 0 200 110"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background arc - centered at 100,100 with radius 80 */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={backgroundArcColor}
            strokeWidth="20"
            strokeLinecap="round"
          />

          {/* Colored arc */}
          <motion.path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={getColor()}
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={`${(normalizedValue / 100) * 251.2} 251.2`}
            initial={{ strokeDasharray: "0 251.2" }}
            animate={{
              strokeDasharray: `${(normalizedValue / 100) * 251.2} 251.2`,
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />

          {/* Center dot - static at the center point (100, 100) */}
          <circle cx="100" cy="100" r="8" fill={needleColor} />

          {/* Needle - rotates around the center dot at (100, 100) */}
          <motion.line
            x1="100"
            y1="100"
            x2="100"
            y2="30"
            stroke={needleColor}
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ rotate: -90 }}
            animate={{ rotate: rotation }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ transformOrigin: "100px 100px" }}
          />
        </svg>
      </div>

      {/* Text Display */}
      <div className="text-center mt-4">
        <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
          {currentKw.toFixed(1)}
          <span className="text-lg text-gray-500 dark:text-gray-400 ml-1">kW</span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          of {maxKw} kW maximum capacity
        </div>
        <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: getColor() }}
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {normalizedValue.toFixed(0)}% Usage
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-between mt-6 px-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-xs text-gray-600 dark:text-gray-400">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-xs text-gray-600 dark:text-gray-400">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-xs text-gray-600 dark:text-gray-400">High</span>
        </div>
      </div>
    </div>
  );
}