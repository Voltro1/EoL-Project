import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Lock, Mail, MapPin, Phone, User, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { PageContext } from "../contexts/PageContext";
import { useTheme } from "../contexts/ThemeContext";
import {
  mapAccountToStoredSession,
  persistAuthSession,
  saveAccountPreferences,
  signupAccount,
} from "../lib/account";

export default function SignUp() {
  const navigate = useNavigate();
  const { setCurrency, setLanguage, setMeasurementUnit } = useContext(PageContext);
  const { theme, setTheme } = useTheme();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setStatus({ type: "error", message: "Passwords don't match." });
      toast.error("Passwords don't match.");
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    try {
      const account = await signupAccount({
        name: formData.fullName.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim(),
        address: formData.address.trim() || undefined,
        password: formData.password,
      });

      const session = mapAccountToStoredSession(account);
      const updatedPreferences = {
        ...session.preferences,
        darkMode: theme === "dark",
      };

      session.preferences = updatedPreferences;
      persistAuthSession(session, false);
      setCurrency(updatedPreferences.currency);
      setLanguage(updatedPreferences.language);
      setMeasurementUnit(updatedPreferences.measurementUnit);
      setTheme(updatedPreferences.darkMode ? "dark" : "light");

      if (updatedPreferences.darkMode) {
        try {
          await saveAccountPreferences(session.userId, updatedPreferences);
        } catch {
          toast.error("Could not save dark mode preference right away.");
        }
      }

      setStatus({
        type: "success",
        message: `Account created successfully. Your ID is ${session.userId}.`,
      });
      toast.success(`Account created. Your ID is ${session.userId}`);
      navigate("/");
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Sign up failed.",
      });
      toast.error(error instanceof Error ? error.message : "Sign up failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-red-50 flex items-center justify-center p-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-black/20 p-8 border border-emerald-100 dark:border-gray-800">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Create Account
            </h1>
            <p className="text-gray-600 dark:text-gray-300">Name, phone, and password are required.</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            {status ? (
              <div
                className={`rounded-xl border px-4 py-3 text-sm ${
                  status.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {status.message}
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="70123456"
                value={formData.phone}
                onChange={handleChange}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Address
              </Label>
              <Input
                id="address"
                name="address"
                type="text"
                placeholder="Beirut, Lebanon"
                value={formData.address}
                onChange={handleChange}
                className="h-11"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600 dark:text-gray-300">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
