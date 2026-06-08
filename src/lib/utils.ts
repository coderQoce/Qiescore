
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(address: string, start = 6, end = 4): string {
  if (!address) return ""
  return `${address.slice(0, start)}...${address.slice(-end)}`
}

export function formatNumber(num: number, decimals = 2): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

export function formatScore(score: number): { grade: string; color: string; label: string } {
  if (score >= 800) {
    return { grade: "Exceptional", color: "#00D084", label: "Low Risk" }
  } else if (score >= 740) {
    return { grade: "Very Good", color: "#00A8E8", label: "Low-Medium Risk" }
  } else if (score >= 670) {
    return { grade: "Good", color: "#7B2CBF", label: "Medium Risk" }
  } else if (score >= 580) {
    return { grade: "Fair", color: "#F59E0B", label: "Medium-High Risk" }
  }
  return { grade: "Poor", color: "#EF4444", label: "High Risk" }
}

export function getRiskLevel(score: number): { level: string; color: string; apr: string } {
  if (score >= 800) {
    return { level: "Minimal", color: "#00D084", apr: "3.5% - 6.5%" }
  } else if (score >= 740) {
    return { level: "Low", color: "#00A8E8", apr: "6.5% - 10%" }
  } else if (score >= 670) {
    return { level: "Moderate", color: "#7B2CBF", apr: "10% - 15%" }
  } else if (score >= 580) {
    return { level: "Medium-High", color: "#F59E0B", apr: "15% - 20%" }
  }
  return { level: "High", color: "#EF4444", apr: "20% - 25%" }
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}