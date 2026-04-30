import { motion } from "motion/react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { ArrowLeft, Check, Globe } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { PageContext } from "../../contexts/PageContext";
import { useTranslation } from "../../hooks/useTranslation";
import { Language as LanguageType } from "../../translations";

const languages: { code: LanguageType, name: string, nativeName: string }[] = [
  { code: "English", name: "English", nativeName: "English" },
  { code: "Arabic", name: "Arabic", nativeName: "العربية" },
  { code: "French", name: "French", nativeName: "Français" },
];

export default function Language() {
  const navigate = useNavigate();
  const { language, setLanguage } = useContext(PageContext);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageType>(language);
  const { t } = useTranslation();

  const handleSave = () => {
    setLanguage(selectedLanguage);
    toast.success(`Language changed to ${languages.find((l) => l.code === selectedLanguage)?.name}`);
    navigate("/config");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/config")}
            className="h-10 w-10 p-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Language
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {t('language')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('preferences')}
                </p>
              </div>
            </div>

            <div className="space-y-2 mt-6">
              {languages.map((language, index) => (
                <motion.div
                  key={language.code}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  onClick={() => setSelectedLanguage(language.code)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedLanguage === language.code
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {language.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {language.nativeName}
                      </p>
                    </div>
                    {selectedLanguage === language.code && (
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={handleSave}
            className="w-full h-12 bg-emerald-500 hover:bg-emerald-600"
          >
            {t('saveChanges')}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
