import { useState, useEffect, useContext } from "react";
import { motion } from "motion/react";
import { PageContext } from "../contexts/PageContext";
import { useTranslation } from "../hooks/useTranslation";
import { TrendingUp, TrendingDown, DollarSign, Zap } from "lucide-react";
import UsageGauge from "../components/UsageGauge";
import { Card } from "../components/ui/card";
import { initialEnergyData } from "../data/homeData";

import './Home.css';

export default function Home() {
  const [data, setData] = useState(initialEnergyData);
  const [animate, setAnimate] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { currency, measurementUnit } = useContext(PageContext);
  const { t } = useTranslation();

  const formatCurrency = (amountInLbp: number) => {
    let convertedAmount = amountInLbp;
    if (currency === 'USD') convertedAmount = amountInLbp / 89500;
    else if (currency === 'EUR') convertedAmount = amountInLbp / 95000;
    
    return `${convertedAmount.toLocaleString(undefined, { maximumFractionDigits: currency === 'LBP' ? 0 : 2 })} ${currency}`;
  };

  const isWatts = measurementUnit === "Watts";
  const displayDailyUsage = isWatts ? (data.dailyUsage * 1000).toLocaleString() : data.dailyUsage;
  const displayMonthlyUsage = isWatts ? (data.monthlyUsage * 1000).toLocaleString() : data.monthlyUsage.toLocaleString();
  const energyUnitLabel = isWatts ? "Wh" : "kWh";

  // Detect dark mode
  useEffect(() => {
    const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(darkMode);

    const darkModeListener = window.matchMedia("(prefers-color-scheme: dark)");
    darkModeListener.addEventListener("change", (e) => setIsDark(e.matches));

    return () => darkModeListener.removeEventListener("change", () => {});
  }, []);

  useEffect(() => {
    setAnimate(true);
    // Simulate real-time updates
    const interval = setInterval(() => {
      setData((prev) => ({
        ...prev,
        currentKw: +(prev.currentKw + (Math.random() - 0.5) * 0.5).toFixed(2),
        currentUsage: Math.min(
          100,
          Math.max(0, prev.currentUsage + (Math.random() - 0.5) * 5)
        ),
        lastUpdate: new Date().toLocaleTimeString(),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: animate ? 1 : 0, y: animate ? 0 : 20 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="statusCard">
          <div className="statusContent">
            <div className="statusLeft">
              <p>{t('serviceStatus')}</p>
              <h2>{data.status.toUpperCase()}</h2>
            </div>
            <div
              className={`statusIndicator ${
                data.status === "on" ? "active" : "inactive"
              }`}
            >
              <Zap
                className={`statusIcon ${
                  data.status === "on" ? "active" : "inactive"
                }`}
              />
            </div>
          </div>
          <p className="statusFooter">
            {t('lastUpdated')}: {data.lastUpdate}
          </p>
        </Card>
      </motion.div>

      {/* Usage Gauge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: animate ? 1 : 0, scale: animate ? 1 : 0.9 }}
        transition={{ delay: 0.2 }}
      >
        <Card className={`gaugeCard ${isDark ? "dark" : ""}`}>
          <h3>{t('currentUsage')}</h3>
          <UsageGauge
            value={data.currentUsage}
            currentKw={data.currentKw}
            maxKw={data.maxKw}
          />
        </Card>
      </motion.div>

      {/* Credits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: animate ? 1 : 0, y: animate ? 0 : 20 }}
        transition={{ delay: 0.3 }}
      >
        <Card className={`creditsCard ${isDark ? "dark" : ""}`}>
          <div className="creditsContent">
            <div className="creditsIcon">
              <DollarSign />
            </div>
            <div className="creditsInfo">
              <p>Available Credits</p>
              <p>{formatCurrency(data.credits)}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Usage Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: animate ? 1 : 0, y: animate ? 0 : 20 }}
        transition={{ delay: 0.4 }}
        className="statsGrid"
      >
        <Card className={`statCard ${isDark ? "dark" : ""}`}>
          <div className="statCardHeader">
            <TrendingUp className="statCardIcon trending-up" />
            <span className="statCardLabel">Daily Usage</span>
          </div>
          <p className="statCardValue">{displayDailyUsage}</p>
          <p className="statCardUnit">{energyUnitLabel} today</p>
        </Card>

        <Card className={`statCard ${isDark ? "dark" : ""}`}>
          <div className="statCardHeader">
            <TrendingDown className="statCardIcon trending-down" />
            <span className="statCardLabel">{t('thisMonth')}</span>
          </div>
          <p className="statCardValue">{displayMonthlyUsage}</p>
          <p className="statCardUnit">{energyUnitLabel} this month</p>
        </Card>
      </motion.div>

      {/* Ad Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: animate ? 1 : 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className={`adCard ${isDark ? "dark" : ""}`}>
          <p className="adLabel">ADVERTISEMENT</p>
          <h4 className="adTitle">
            Save up to 30% on your electricity bill!
          </h4>
          <p className="adDescription">
            Switch to off-peak hours for better rates. Learn more about our
            savings programs.
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
