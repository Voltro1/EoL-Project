import { motion } from "motion/react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { ArrowLeft, Camera, Mail, MapPin, Phone, Save, User } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useTranslation } from "../../hooks/useTranslation";
import {
  getStoredAuthSession,
  mapAccountToStoredSession,
  saveAccountProfile,
  updateStoredSession,
} from "../../lib/account";

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const account = getStoredAuthSession();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState({
    name: account?.name || "",
    email: account?.email || "",
    phone: account?.phone || "",
    address: account?.address || "",
    profilePicture: account?.profilePicture || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setStatus({ type: "error", message: "Please choose an image file." });
      toast.error("Please choose an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setStatus(null);
        setFormData((prev) => ({ ...prev, profilePicture: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!account?.userId) {
      setStatus({ type: "error", message: "No active account found." });
      toast.error("No active account found.");
      return;
    }

    setIsSaving(true);
    setStatus(null);

    try {
      const updatedAccount = await saveAccountProfile(account.userId, {
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim(),
        address: formData.address.trim() || undefined,
        profilePicture: formData.profilePicture || undefined,
      });

      updateStoredSession(mapAccountToStoredSession(updatedAccount));
      setFormData((prev) => ({
        ...prev,
        name: updatedAccount.name,
        email: updatedAccount.email || "",
        phone: updatedAccount.phone,
        address: updatedAccount.address || "",
        profilePicture: updatedAccount.profilePicture || "",
      }));
      setStatus({ type: "success", message: "Profile updated successfully." });
      toast.success("Profile updated successfully!");
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Could not update profile.",
      });
      toast.error(error instanceof Error ? error.message : "Could not update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
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
            {t("profileSettings")}
          </h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="relative">
                {formData.profilePicture ? (
                  <img
                    src={formData.profilePicture}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border border-emerald-200"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {formData.name || t("profileSettings")}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Click the camera icon to update
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 space-y-5 dark:bg-gray-800 dark:border-gray-700">
            {status ? (
              <div
                className={`rounded-2xl border px-4 py-3 text-sm ${
                  status.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {status.message}
              </div>
            ) : null}

            <div>
              <Label className="text-gray-700 dark:text-gray-300">
                {t("userId")}
              </Label>
              <div className="mt-2 flex items-center gap-2 rounded-xl border bg-gray-50 px-3 py-3 dark:border-gray-700 dark:bg-gray-900/40">
                <User className="w-5 h-5 text-gray-400" />
                <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                  {account?.userId || "UID-0"}
                </span>
              </div>
            </div>

            <div>
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                {t("fullName")}
              </Label>
              <div className="mt-2 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-400" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                {t("emailAddress")}
              </Label>
              <div className="mt-2 flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">
                {t("phoneNumber")}
              </Label>
              <div className="mt-2 flex items-center gap-2">
                <Phone className="w-5 h-5 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="text-gray-700 dark:text-gray-300">
                {t("address")}
              </Label>
              <div className="mt-2 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full h-12 bg-emerald-500 hover:bg-emerald-600"
          >
            <Save className="w-5 h-5 mr-2" />
            {isSaving ? "Saving..." : t("saveChanges")}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
