import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Zap, User, Lock } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export default function Login() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const checkPass = (e: string) => {
    return true
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - store user ID in sessionStorage
    if (rememberMe){
      localStorage.setItem("userId", userId || "LEB-12345");
      localStorage.setItem("isAuth", checkPass(password) ? "t" : "f");
      localStorage.setItem("rememberMe", rememberMe ? "t" : "f");
    }
    else{
      localStorage.removeItem("userId");
      localStorage.removeItem("isAuth");
      localStorage.removeItem("rememberMe");
    }
    sessionStorage.setItem("userId", userId || "LEB-12345");
    sessionStorage.setItem("isAuthenticated", "true");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-red-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Électricité du Liban
            </h1>
            <p className="text-gray-600">Monitor your electricity usage</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="userId" className="flex items-center gap-2 text-black">
                <User className="w-4 h-4" />
                User ID
              </Label>
              <Input
                id="userId"
                type="text"
                placeholder="LEB-12345"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="h-12"
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
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Input
                  id="rememberme"
                  type="checkbox"
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-5 w-5"
                />
                <Label htmlFor="rememberme" className="text-black">
                  Remember me
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
            >
              Login
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-4">
              Demo credentials: Any ID and password
            </p>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
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