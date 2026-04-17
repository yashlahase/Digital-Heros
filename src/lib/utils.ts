import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(date))
}

export function formatMonthYear(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' }).format(new Date(date))
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function isSubscriptionActive(status: string | null): boolean {
  return status === 'active'
}

export function scoreMatchCount(userScores: number[], drawNumbers: number[]): number {
  const userSet = new Set(userScores)
  let matches = 0
  for (const num of drawNumbers) {
    if (userSet.has(num)) matches++
  }
  return matches
}
