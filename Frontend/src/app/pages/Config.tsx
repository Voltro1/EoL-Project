import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  Bell,
  ChevronRight,
  DollarSign,
  Globe,
  Info,
  Lock,
  LogOut,
  Moon,
  Trash2,
  User,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { DeleteAccountDialog } from "../components/DeleteAccountDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import {
  PageContext,
  type Currency,
  type MeasurementUnit,
} from "../contexts/PageContext";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "../hooks/useTranslation";
import {
  clearAuthSession,
  getStoredAuthSession,
  mapAccountToStoredSession,
  removeAccount,
  saveAccountPreferences,
  updateStoredSession,
} from "../lib/account";
import type { Language } from "../translations";

export default function Config() {
  const navigate = useNavigate();
  const account = useMemo(() => getStoredAuthSession(), []);
  const { language, setLanguage, currency, setCurrency, measurementUnit, setMeasurementUnit } =
    useContext(PageContext);
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [isSavingPreference, setIsSavingPreference] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleLogout = () => {
    clearAuthSession();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const persistPreferences = async (nextPreferences: {
    currency: Currency;
    language: Language;
    measurementUnit: MeasurementUnit;
    darkMode: boolean;
  }) => {
    if (!account?.userId) {
      toast.error("No active account found.");
      return;
    }

    setIsSavingPreference(true);

    try {
      const updatedAccount = await saveAccountPreferences(account.userId, nextPreferences);
      updateStoredSession(mapAccountToStoredSession(updatedAccount));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save preference.");
    } finally {
      setIsSavingPreference(false);
    }
  };

  const handleCurrencyChange = async (value: string) => {
    const nextCurrency = value as Currency;
    setCurrency(nextCurrency);
    await persistPreferences({
      currency: nextCurrency,
      language,
      measurementUnit,
      darkMode: theme === "dark",
    });
  };

  const handleLanguageChange = async (value: string) => {
    const nextLanguage = value as Language;
    setLanguage(nextLanguage);
    await persistPreferences({
      currency,
      language: nextLanguage,
      measurementUnit,
      darkMode: theme === "dark",
    });
  };

  const handleUnitChange = async (value: string) => {
    const nextUnit = value as MeasurementUnit;
    setMeasurementUnit(nextUnit);
    await persistPreferences({
      currency,
      language,
      measurementUnit: nextUnit,
      darkMode: theme === "dark",
    });
  };

  const handleThemeChange = async (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
    await persistPreferences({
      currency,
      language,
      measurementUnit,
      darkMode: checked,
    });
  };

  const handleDeleteAccount = async () => {
    if (!account?.userId) {
      toast.error("No active account found.");
      return;
    }

    setIsDeletingAccount(true);

    try {
      await removeAccount(account.userId);
      clearAuthSession();
      toast.success("Account deleted permanently");
      navigate("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete account.");
    } finally {
      setIsDeletingAccount(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/config/profile")}
        className="w-full bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-6 flex items-center justify-between text-white shadow-lg hover:shadow-xl transition-shadow"
      >
        <div className="flex items-center gap-4">
          {account?.profilePicture ? (
            <img
              src={account.profilePicture}
              alt={account.name || "Profile"}
              className="w-16 h-16 rounded-full object-cover border-2 border-white/40 shadow-sm"
            />
          ) : (
            <div className="w-16 h-16 bg-emerald-400/40 rounded-full flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
          )}
          <div className="text-left">
            <p className="text-xl">{account?.userId || "UID-0"}</p>
            <p className="text-emerald-100 text-sm">
              {account?.name || t("activeAccount")}
            </p>
          </div>
        </div>
        <ChevronRight className="w-6 h-6" />
      </button>

      <div>
        <h2 className="text-gray-500 dark:text-gray-400 text-sm mb-3 px-1">{t("account")}</h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl divide-y dark:divide-gray-700 overflow-hidden shadow-sm">
          <button
            onClick={() => navigate("/config/profile")}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
              <span className="dark:text-white">{t("profileSettings")}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={() => navigate("/config/privacy")}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Lock className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
              <span className="dark:text-white">{t("privacySecurity")}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-gray-500 dark:text-gray-400 text-sm mb-3 px-1">{t("preferences")}</h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl divide-y dark:divide-gray-700 overflow-hidden shadow-sm">
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
              <span className="dark:text-white">{t("currency")}</span>
            </div>
            <Select value={currency} onValueChange={handleCurrencyChange} disabled={isSavingPreference}>
              <SelectTrigger className="w-32 border-0 bg-gray-50 dark:bg-gray-700 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LBP">LBP</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
              <span className="dark:text-white">{t("language")}</span>
            </div>
            <Select value={language} onValueChange={handleLanguageChange} disabled={isSavingPreference}>
              <SelectTrigger className="w-32 border-0 bg-gray-50 dark:bg-gray-700 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Arabic">العربية</SelectItem>
                <SelectItem value="French">Français</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
              <span className="dark:text-white">{t("measurementUnit")}</span>
            </div>
            <Select value={measurementUnit} onValueChange={handleUnitChange} disabled={isSavingPreference}>
              <SelectTrigger className="w-32 border-0 bg-gray-50 dark:bg-gray-700 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Watts">Watts</SelectItem>
                <SelectItem value="Kilowatts">Kilowatts</SelectItem>
                <SelectItem value="kWh">kWh</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
              <span className="dark:text-white">{t("darkMode")}</span>
            </div>
            <Switch checked={theme === "dark"} onCheckedChange={handleThemeChange} />
          </div>

          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
              <span className="dark:text-white">{t("notifications")}</span>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-gray-500 dark:text-gray-400 text-sm mb-3 px-1">{t("support")}</h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl divide-y dark:divide-gray-700 overflow-hidden shadow-sm">
          <button
            onClick={() => navigate("/config/about")}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Info className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
              <span className="dark:text-white">{t("about")}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleLogout}
          className="w-full bg-white dark:bg-gray-800 rounded-2xl px-4 py-4 flex items-center justify-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm"
        >
          <LogOut className="w-5 h-5" />
          <span>{t("logout")}</span>
        </button>

        <button
          onClick={() => setDeleteDialogOpen(true)}
          disabled={isDeletingAccount}
          className="w-full bg-white dark:bg-gray-800 rounded-2xl px-4 py-4 flex items-center justify-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm disabled:opacity-60"
        >
          <Trash2 className="w-5 h-5" />
          <span>{t("deleteAccount")}</span>
        </button>
      </div>

      <DeleteAccountDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
}
