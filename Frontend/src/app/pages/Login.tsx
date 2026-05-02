import { useContext, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Lock, User, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useTheme } from "../contexts/ThemeContext";
import { PageContext } from "../contexts/PageContext";
import {
  getStoredAuthSession,
  loginAccount,
  mapAccountToStoredSession,
  persistAuthSession,
} from "../lib/account";

export default function Login() {
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const { setCurrency, setLanguage, setMeasurementUnit } = useContext(PageContext);
  const rememberedAccount = useMemo(() => getStoredAuthSession(), []);
  const [userId, setUserId] = useState(rememberedAccount?.userId || "");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem("rememberMe") === "true",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const normalizeUserId = (value: string) => {
    const trimmed = value.trim();
    if (/^\d+$/.test(trimmed)) {
      return `UID-${trimmed}`;
    }

    return trimmed;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const account = await loginAccount(normalizeUserId(userId), password);
      const session = mapAccountToStoredSession(account);

      persistAuthSession(session, rememberMe);
      setCurrency(session.preferences.currency);
      setLanguage(session.preferences.language);
      setMeasurementUnit(session.preferences.measurementUnit);
      setTheme(session.preferences.darkMode ? "dark" : "light");

      setStatus({ type: "success", message: `Welcome back, ${session.name}.` });
      toast.success(`Welcome back, ${session.name}`);
      navigate("/");
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Login failed.",
      });
      toast.error(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-red-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Électricité du Liban
            </h1>
            <p className="text-gray-600">Log in with `UID-123` or just `123`</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
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
              <Label htmlFor="userId" className="flex items-center gap-2 text-black">
                <User className="w-4 h-4" />
                User ID
              </Label>
              <Input
                id="userId"
                type="text"
                placeholder="UID-1 or 1"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2 text-black">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
                required
              />
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="rememberme"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <Label htmlFor="rememberme" className="text-black">
                Remember me
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-4">
              Sign up first to receive your UID account ID.
            </p>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-emerald-600 hover:text-emerald-700 font-semibold"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
