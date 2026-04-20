import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, User, Mail, Phone, MapPin, Save, Camera } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export default function ProfileSettings() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: sessionStorage.getItem("userId") || "LEB-12345",
    email: "user@example.com",
    phone: "+961 70 123 456",
    address: "Beirut, Lebanon",
  });

  const handleSave = () => {
    sessionStorage.setItem("userId", formData.username);
    alert("Profile updated successfully!");
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
            Profile Settings
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6 max-w-2xl mx-auto">
        {/* Profile Picture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Profile Photo
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Click the camera icon to update
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 space-y-5 dark:bg-gray-800 dark:border-gray-700">
            <div>
              <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">
                Username / User ID
              </Label>
              <div className="mt-2 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-400" />
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                Email Address
              </Label>
              <div className="mt-2 flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">
                Phone Number
              </Label>
              <div className="mt-2 flex items-center gap-2">
                <Phone className="w-5 h-5 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="text-gray-700 dark:text-gray-300">
                Address
              </Label>
              <div className="mt-2 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="flex-1"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleSave}
            className="w-full h-12 bg-emerald-500 hover:bg-emerald-600"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
