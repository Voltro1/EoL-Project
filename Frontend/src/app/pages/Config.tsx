import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { PageContext } from '../contexts/PageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Zap, User, Lock, DollarSign, Globe, Bell, Info, LogOut, Trash2, ChevronRight, Moon } from 'lucide-react';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { DeleteAccountDialog } from '../components/DeleteAccountDialog';
import { useTranslation } from '../hooks/useTranslation';
import { toast } from 'sonner';

interface ConfigPageProps {
  userData: any;
  preferences: any;
  updatePreference: (key: string, value: any) => void;
}

export default function Config({ 
  userData = { name: 'John Doe', email: 'john.doe@example.com', phone: '+961 3 123 456', address: 'Beirut, Lebanon' }, 
  preferences = { currency: 'LBP', language: 'English', measurementUnit: 'Watts', darkMode: false, notifications: true }, 
  updatePreference = (key: string, value: any) => console.log('Update preference:', key, value) 
}: Partial<ConfigPageProps> = {}) {
  const { language, setLanguage, currency, setCurrency, measurementUnit, setMeasurementUnit } = useContext(PageContext);
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleLogout = () => {
    toast.success('Logged out successfully');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  const handleDeleteAccount = () => {
    toast.error('Account deleted permanently');
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Account Status Card */}
      <button
        onClick={() => navigate('/config/profile')}
        className="w-full bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-6 flex items-center justify-between text-white shadow-lg hover:shadow-xl transition-shadow"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-emerald-400/40 rounded-full flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div className="text-left">
            <p className="text-xl">{sessionStorage.getItem("userId") || "LEB-12345"}</p>
            <p className="text-emerald-100 text-sm">{t('activeAccount')}</p>
          </div>
        </div>
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Account Section */}
      <div>
        <h2 className="text-gray-500 dark:text-gray-400 text-sm mb-3 px-1">{t('account')}</h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl divide-y dark:divide-gray-700 overflow-hidden shadow-sm">
          <button
            onClick={() => navigate('/config/profile')}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
              <span className="dark:text-white">{t('profileSettings')}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={() => navigate('/config/privacy')}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Lock className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
              <span className="dark:text-white">{t('privacySecurity')}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Preferences Section */}
      <div>
        <h2 className="text-gray-500 dark:text-gray-400 text-sm mb-3 px-1">{t('preferences')}</h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl divide-y dark:divide-gray-700 overflow-hidden shadow-sm">
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
              <span className="dark:text-white">{t('currency')}</span>
            </div>
            <Select value={currency} onValueChange={(value) => setCurrency(value as any)}>
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
              <span className="dark:text-white">{t('language')}</span>
            </div>
            <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
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
              <span className="dark:text-white">{t('measurementUnit')}</span>
            </div>
            <Select value={measurementUnit} onValueChange={(value) => setMeasurementUnit(value as any)}>
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
              <span className="dark:text-white">{t('darkMode')}</span>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>

          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
              <span className="dark:text-white">{t('notifications')}</span>
            </div>
            <Switch
              checked={preferences.notifications}
              onCheckedChange={(checked) => updatePreference('notifications', checked)}
            />
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div>
        <h2 className="text-gray-500 dark:text-gray-400 text-sm mb-3 px-1">{t('support')}</h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl divide-y dark:divide-gray-700 overflow-hidden shadow-sm">
          <button
            onClick={() => navigate('/config/about')}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Info className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
              <span className="dark:text-white">{t('about')}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Account Actions */}
      <div className="space-y-3">
        <button
          onClick={handleLogout}
          className="w-full bg-white dark:bg-gray-800 rounded-2xl px-4 py-4 flex items-center justify-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm"
        >
          <LogOut className="w-5 h-5" />
          <span>{t('logout')}</span>
        </button>

        <button
          onClick={() => setDeleteDialogOpen(true)}
          className="w-full bg-white dark:bg-gray-800 rounded-2xl px-4 py-4 flex items-center justify-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm"
        >
          <Trash2 className="w-5 h-5" />
          <span>{t('deleteAccount')}</span>
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