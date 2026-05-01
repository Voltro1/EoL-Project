/**
 * Home Module - Utility Functions
 * Common calculations, formatting, and data transformation operations
 */

import type { MeterConfig } from '../types/homeTypes';
import { currencyConfigs, measurementConfigs, meterConfig } from '../data/homeData';

/**
 * Generate a random value within the ±variationRange of the base meter value
 * Ensures the value stays within min and max bounds
 * @returns Number between meterConfig.minValue and meterConfig.maxValue
 */
export function generateRandomMeterValue(): number {
  const variation = (Math.random() - 0.5) * meterConfig.variationRange * 2;
  let newValue = meterConfig.baseValue + variation;

  // Constrain within boundaries
  newValue = Math.max(meterConfig.minValue, Math.min(meterConfig.maxValue, newValue));

  return parseFloat(newValue.toFixed(2));
}

/**
 * Format currency for display with appropriate conversion and decimals
 * @param amountInLbp - Amount in Lebanese Pounds
 * @param currency - Currency code (LBP, USD, EUR)
 * @returns Formatted currency string
 */
export function formatCurrency(amountInLbp: number, currency: string): string {
  const config = currencyConfigs[currency] || currencyConfigs.LBP;
  const convertedAmount = amountInLbp / config.exchangeRate;

  return `${convertedAmount.toLocaleString(undefined, {
    maximumFractionDigits: config.fractionDigits,
  })} ${currency}`;
}

/**
 * Format energy usage based on measurement unit
 * @param usage - Usage in kWh
 * @param unit - Measurement unit (kWh or Watts)
 * @returns Formatted usage string
 */
export function formatEnergyUsage(usage: number, unit: string): string {
  const config = measurementConfigs[unit] || measurementConfigs.kWh;
  const convertedUsage = usage * config.multiplier;

  return convertedUsage.toLocaleString();
}

/**
 * Get the abbreviation for the measurement unit
 * @param unit - Measurement unit (kWh or Watts)
 * @returns Unit abbreviation
 */
export function getEnergyUnitLabel(unit: string): string {
  const config = measurementConfigs[unit] || measurementConfigs.kWh;
  return config.abbreviation;
}

/**
 * Format a timestamp to a readable time string
 * @param date - Date or timestamp
 * @returns Formatted time string (HH:MM:SS)
 */
export function formatTime(date: Date = new Date()): string {
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Calculate percentage of usage relative to maximum
 * @param current - Current usage
 * @param max - Maximum capacity
 * @returns Percentage as number (0-100)
 */
export function calculateUsagePercentage(current: number, max: number): number {
  return Math.min(100, Math.max(0, (current / max) * 100));
}

/**
 * Get CSS classes for status indicator based on service status
 * @param status - Service status (on or off)
 * @returns Object with color and animation CSS class names
 */
export function getStatusClasses(status: "on" | "off"): {
  indicatorBg: string;
  iconColor: string;
  animate: string;
} {
  if (status === "on") {
    return {
      indicatorBg: "bg-yellow-400",
      iconColor: "text-emerald-900",
      animate: "animate-pulse",
    };
  }
  return {
    indicatorBg: "bg-red-500",
    iconColor: "text-white",
    animate: "",
  };
}

/**
 * Clamp a value between min and max bounds
 * @param value - Value to clamp
 * @param min - Minimum bound
 * @param max - Maximum bound
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Get meter variation in both directions with boundary checking
 * @param baseValue - Base/initial value
 * @param direction - Direction of variation (-1 to 1)
 * @returns New meter value within bounds
 */
export function calculateMeterVariation(baseValue: number, direction: number): number {
  const maxVariation = meterConfig.variationRange;
  const variation = (Math.random() - 0.5) * maxVariation * 2;

  return clamp(
    baseValue + variation,
    meterConfig.minValue,
    meterConfig.maxValue
  );
}

/**
 * Check if current usage exceeds a warning threshold
 * @param current - Current usage percentage
 * @param threshold - Warning threshold (default 80%)
 * @returns Boolean indicating if threshold exceeded
 */
export function isUsageHigh(current: number, threshold: number = 80): boolean {
  return current > threshold;
}
