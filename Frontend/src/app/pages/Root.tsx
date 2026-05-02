import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { restoreRememberedSession } from "../lib/account";

export default function Root() {
  const navigate = useNavigate();

  useEffect(() => {
    restoreRememberedSession();
    const isAuthenticated = sessionStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
      <Header />
      <main className="flex-1 overflow-y-auto relative pb-24">
        <Outlet />
      </main>
      <Navbar />
    </div>
  );
}
