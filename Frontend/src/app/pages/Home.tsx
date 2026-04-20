import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown, DollarSign, Zap } from "lucide-react";
import UsageGauge from "../components/UsageGauge";
import { Card } from "../components/ui/card";

// Mock data
const mockData = {
  currentUsage: 72, // percentage
  currentKw: 8.5,
  maxKw: 12,
  dailyUsage: 204,
  monthlyUsage: 5632,
  credits: 45000,
  status: "on",
  lastUpdate: new Date().toLocaleTimeString(),
};

export default function Home() {
  const [data, setData] = useState(mockData);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    // Simulate real-time updates
    const interval = setInterval(() => {
      setData((prev) => ({
        ...prev,
        currentKw: +(prev.currentKw + (Math.random() - 0.5) * 0.5).toFixed(2),
        currentUsage: Math.min(
          100,
          Math.max(0, prev.currentUsage + (Math.random() - 0.5) * 5)
        ),
        lastUpdate: new Date().toLocaleTimeString(),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-4 py-6 space-y-6 max-w-2xl mx-auto">
      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: animate ? 1 : 0, y: animate ? 0 : 20 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-emerald-100 text-sm">Dawle Status</p>
              <h2 className="text-3xl font-bold mt-1">
                {data.status.toUpperCase()}
              </h2>
            </div>
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                data.status === "on"
                  ? "bg-yellow-400 animate-pulse"
                  : "bg-red-500"
              }`}
            >
              <Zap
                className={`w-8 h-8 ${
                  data.status === "on" ? "text-emerald-900" : "text-white"
                }`}
              />
            </div>
          </div>
          <p className="text-emerald-100 text-sm">
            Last updated: {data.lastUpdate}
          </p>
        </Card>
      </motion.div>

      {/* Usage Gauge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: animate ? 1 : 0, scale: animate ? 1 : 0.9 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-8 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-center mb-6 text-gray-700 dark:text-gray-300">Current Usage</h3>
          <UsageGauge
            value={data.currentUsage}
            currentKw={data.currentKw}
            maxKw={data.maxKw}
          />
        </Card>
      </motion.div>

      {/* Credits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: animate ? 1 : 0, y: animate ? 0 : 20 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-300">Available Credits</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {data.credits.toLocaleString()} LBP
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Usage Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: animate ? 1 : 0, y: animate ? 0 : 20 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 gap-4"
      >
        <Card className="p-5 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Daily Usage</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.dailyUsage}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">kWh today</p>
        </Card>

        <Card className="p-5 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Monthly Usage</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {data.monthlyUsage.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">kWh this month</p>
        </Card>
      </motion.div>

      {/* Ad Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: animate ? 1 : 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-purple-200 dark:border-purple-800">
          <p className="text-xs text-purple-700 dark:text-purple-300 mb-1">ADVERTISEMENT</p>
          <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
            Save up to 30% on your electricity bill!
          </h4>
          <p className="text-sm text-purple-700 dark:text-purple-300">
            Switch to off-peak hours for better rates. Learn more about our
            savings programs.
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
