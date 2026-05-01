/**
 * Home Module - Mock Data
 * Contains initial data for dashboard and configuration
 */

import type { EnergyUsageData, MeterConfig, CurrencyConfig, MeasurementConfig } from '../types/homeTypes';

/**
 * Meter value configuration
 * The base value is randomized on first load (40-90)
 * Updates oscillate within ±5 of the current value
 */
export const meterConfig: MeterConfig = {
  baseValue: Math.floor(Math.random() * (90 - 40 + 1)) + 40, // Random 40-90 on first load
  minValue: 0,
  maxValue: 100,
  variationRange: 5, // ±5 oscillation
};

/**
 * Initial energy usage data
 * Dashboard metrics that display usage and credits
 */
export const initialEnergyData: EnergyUsageData = {
  currentUsage: meterConfig.baseValue, // Starts with random meter value
  currentKw: 8.5,
  maxKw: 12,
  dailyUsage: 204,
  monthlyUsage: 5632,
  credits: 45000,
  status: "on",
  lastUpdate: new Date().toLocaleTimeString(),
};

/**
 * Currency configurations
 */
export const currencyConfigs: Record<string, CurrencyConfig> = {
  LBP: {
    code: "LBP",
    symbol: "ل.ل",
    exchangeRate: 1,
    fractionDigits: 0,
  },
  USD: {
    code: "USD",
    symbol: "$",
    exchangeRate: 89500,
    fractionDigits: 2,
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    exchangeRate: 95000,
    fractionDigits: 2,
  },
};

/**
 * Measurement unit configurations
 */
export const measurementConfigs: Record<string, MeasurementConfig> = {
  kWh: {
    name: "kWh",
    multiplier: 1,
    abbreviation: "kWh",
  },
  Watts: {
    name: "Watts",
    multiplier: 1000,
    abbreviation: "Wh",
  },
};

/**
 * Dashboard card labels and text
 */
export const dashboardLabels = {
  serviceStatus: "serviceStatus",
  currentUsage: "currentUsage",
  lastUpdated: "lastUpdated",
  availableCredits: "Available Credits",
  dailyUsage: "Daily Usage",
  monthlyUsage: "thisMonth",
  advertisement: "ADVERTISEMENT",
  promoTitle: "Save up to 30% on your electricity bill!",
  promoDescription: "Switch to off-peak hours for better rates. Learn more about our savings programs.",
} as const;

/**
 * Animation configuration
 */
export const animationConfig = {
  updateInterval: 3000, // Update every 3 seconds
  staggerDelay: 0.1, // Delay between staggered animations
} as const;

/**
 * Color scheme configuration
 */
export const colorScheme = {
  status: {
    active: "from-emerald-500 to-emerald-600",
    inactive: "bg-red-500",
    indicatorActive: "bg-yellow-400",
    indicatorInactive: "bg-red-500",
  },
  credits: {
    light: "from-blue-50 to-blue-100",
    dark: "from-blue-900/30 to-blue-800/30",
    border: "border-blue-200",
  },
  ads: {
    light: "from-purple-100 to-pink-100",
    dark: "from-purple-900/30 to-pink-900/30",
    border: "border-purple-200",
  },
} as const;
