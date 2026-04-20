import { Bell, Zap } from "lucide-react";
import { motion } from "motion/react";

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors duration-300">
      {/* Announcement Banner */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: "auto" }}
        className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-4 py-2 text-sm flex items-center gap-2"
      >
        <Bell className="w-4 h-4 flex-shrink-0" />
        <p className="truncate">
          Scheduled maintenance on March 1st from 2:00 AM - 6:00 AM
        </p>
      </motion.div>

      {/* Main Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-white">EDL</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Électricité du Liban</p>
          </div>
        </div>

        {/* User Info */}
        <div className="text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">User ID</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {sessionStorage.getItem("userId") || "LEB-12345"}
          </p>
        </div>
      </div>
    </header>
  );
}
