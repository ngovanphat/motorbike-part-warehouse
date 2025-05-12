import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

/**
 * Removes Vietnamese diacritics (accent marks) from a string
 * This allows searching for "dau nhot" to match "Dầu nhớt"
 */
export function removeDiacritics(str: string): string {
  return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // Remove combining diacritical marks
    .replace(/[Đ]/g, 'D')              // Replace Đ with D
    .replace(/[đ]/g, 'd')              // Replace đ with d
    .toLowerCase()
}

/**
 * Check if a string matches a search query, accounting for diacritics and case
 */
export function textMatchesSearch(text: string, searchQuery: string): boolean {
  // If the search query is empty, return true
  if (!searchQuery.trim()) return true
  
  // Convert both strings to lowercase and remove diacritics
  const normalizedText = removeDiacritics(text)
  const normalizedQuery = removeDiacritics(searchQuery)
  
  // Check if the normalized text includes the normalized query
  return normalizedText.includes(normalizedQuery)
}
