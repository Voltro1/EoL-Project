import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  User,
  Bell,
  Globe,
  Lock,
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Smartphone,
  DollarSign,
  Zap,
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Switch } from "../components/ui/switch";
import { Button } from "../components/ui/button";
import { useTheme } from "../contexts/ThemeContext";
import LanguageModal from "../components/LanguageModal";

interface SettingsItem {
  icon: any;
  label: string;
  hasToggle?: boolean;
  enabled?: boolean;
  hasArrow?: boolean;
  value?: string;
  path?: string;
  external?: boolean;
}

export default function Config() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedCurrency, setSelectedCurrency] = useState("LBP");
  const [selectedMeasurement, setSelectedMeasurement] = useState("Watts");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const accountItems = [
    { icon: User, label: "Profile Settings", hasArrow: true, path: "/config/profile" },
    { icon: Lock, label: "Privacy & Security", hasArrow: true, path: "/config/privacy" },
  ];

  const supportItems = [
    { icon: HelpCircle, label: "Help Center", hasArrow: true, external: true },
    { icon: Smartphone, label: "About", hasArrow: true, path: "/config/about" },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("userId");
    navigate("/login");
  };

  const handleItemClick = (item: SettingsItem) => {
    if (item.external && item.label === "Help Center") {
      window.open("https://www.wikipedia.org", "_blank");
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const getLanguageName = (code: string) => {
    const languages: { [key: string]: string } = {
      en: "English",
      ar: "العربية",
      fr: "Français",
    };
    return languages[code] || "English";
  };

  return (
    <>
      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={setSelectedLanguage}
      />
      <div className="px-4 py-6 space-y-4 max-w-2xl mx-auto">
      {/* User Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card
          className="p-6 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 cursor-pointer"
          onClick={() => navigate("/config/profile")}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">
                {sessionStorage.getItem("userId") || "LEB-12345"}
              </h2>
              <p className="text-emerald-100 text-sm">Active Account</p>
            </div>
            <ChevronRight className="w-6 h-6 text-white/60" />
          </div>
        </Card>
      </motion.div>

      {/* Account Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 px-1">
          Account
        </h3>
        <Card className="overflow-hidden dark:bg-gray-800 dark:border-gray-700">
          {accountItems.map((item, index) => (
            <div
              key={item.label}
              className={`p-3.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                index !== accountItems.length - 1
                  ? "border-b border-gray-100 dark:border-gray-700"
                  : ""
              }`}
              onClick={() => handleItemClick(item)}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <item.icon className="w-4.5 h-4.5 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.label}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
          ))}
        </Card>
      </motion.div>

      {/* Preferences Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 px-1">
          Preferences
        </h3>
        <Card className="overflow-hidden dark:bg-gray-800 dark:border-gray-700">
          {/* Currency */}
          <div className="p-3.5 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <DollarSign className="w-4.5 h-4.5 text-gray-600 dark:text-gray-300" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Currency</p>
              </div>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                onClick={(e) => e.stopPropagation()}
              >
                <option value="LBP">LBP</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          {/* Language */}
          <div
            className="p-3.5 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
            onClick={() => setIsLanguageModalOpen(true)}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Globe className="w-4.5 h-4.5 text-gray-600 dark:text-gray-300" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Language</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {getLanguageName(selectedLanguage)}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
          </div>

          {/* Measurement Unit */}
          <div className="p-3.5 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Zap className="w-4.5 h-4.5 text-gray-600 dark:text-gray-300" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Measurement Unit
                </p>
              </div>
              <select
                value={selectedMeasurement}
                onChange={(e) => setSelectedMeasurement(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                onClick={(e) => e.stopPropagation()}
              >
                <option value="Watts">Watts</option>
                <option value="Volt">Volt</option>
                <option value="Amps">Amps</option>
              </select>
            </div>
          </div>

          {/* Dark Mode */}
          <div className="p-3.5 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Moon className="w-4.5 h-4.5 text-gray-600 dark:text-gray-300" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</p>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
            </div>
          </div>

          {/* Notifications */}
          <div className="p-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Bell className="w-4.5 h-4.5 text-gray-600 dark:text-gray-300" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Notifications
                </p>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Support Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 px-1">
          Support
        </h3>
        <Card className="overflow-hidden dark:bg-gray-800 dark:border-gray-700">
          {supportItems.map((item, index) => (
            <div
              key={item.label}
              className={`p-3.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                index !== supportItems.length - 1
                  ? "border-b border-gray-100 dark:border-gray-700"
                  : ""
              }`}
              onClick={() => handleItemClick(item)}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <item.icon className="w-4.5 h-4.5 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.label}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
          ))}
        </Card>
      </motion.div>

      {/* Logout Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          variant="outline"
          className="w-full h-11 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </motion.div>

      {/* App Version */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-sm text-gray-500 dark:text-gray-400 py-2"
      >
        EDL App v1.0.0
        <br />
        Électricité du Liban
      </motion.div>
    </div>
    </>
  );
}
