/**
 * Home Module - TypeScript Interfaces
 * Defines all data structures for usage monitoring and dashboard display
 */

/**
 * Real-time energy usage data
 */
export interface EnergyUsageData {
  currentUsage: number; // Percentage (0-100)
  currentKw: number; // Current kilowatts
  maxKw: number; // Maximum capacity in kilowatts
  dailyUsage: number; // Daily usage in kWh
  monthlyUsage: number; // Monthly usage in kWh
  credits: number; // Available credits in LBP
  status: "on" | "off"; // Service status
  lastUpdate: string; // ISO timestamp
}

/**
 * Usage statistics display data
 */
export interface UsageStats {
  daily: number; // Daily usage amount
  monthly: number; // Monthly usage amount
  unit: "kWh" | "Wh"; // Measurement unit
  label: string; // Display unit label
}

/**
 * Meter value configuration with boundaries
 */
export interface MeterConfig {
  baseValue: number; // Initial random value
  minValue: number; // Minimum boundary
  maxValue: number; // Maximum boundary
  variationRange: number; // +/- range for random variation
}

/**
 * Service status information
 */
export interface ServiceStatus {
  status: "on" | "off";
  label: string;
  indicatorColor: "emerald" | "red";
  pulseAnimation: boolean;
}

/**
 * Advertisement/Promotional content
 */
export interface PromoContent {
  id: string;
  label: string;
  title: string;
  description: string;
  visible: boolean;
}

/**
 * Measurement unit configuration
 */
export interface MeasurementConfig {
  name: "kWh" | "Watts";
  multiplier: number; // Conversion multiplier
  abbreviation: string;
}

/**
 * Currency configuration
 */
export interface CurrencyConfig {
  code: "LBP" | "USD" | "EUR";
  symbol: string;
  exchangeRate: number; // Rate from LBP
  fractionDigits: number;
}
