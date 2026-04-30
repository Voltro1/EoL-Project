import { NavLink } from "react-router";
import { Home, DollarSign, Zap, Settings } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { TranslationKey } from "../translations";

const navItems: { path: string, labelKey: TranslationKey, icon: any }[] = [
  { path: "/", labelKey: "home", icon: Home },
  { path: "/finance", labelKey: "finance", icon: DollarSign },
  { path: "/services", labelKey: "service", icon: Zap },
  { path: "/config", labelKey: "config", icon: Settings },
];

export default function Navbar() {
  const { t } = useTranslation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 transition-colors duration-300">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ path, labelKey, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                isActive
                  ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{t(labelKey)}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
