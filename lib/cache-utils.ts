import { Product } from "@/types/product"

/**
 * Constants for product cache
 */
export const CACHE_KEY = 'cached_products'
export const CACHE_EXPIRY_KEY = 'cached_products_expiry'
export const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

/**
 * Checks if there is valid cached product data available
 */
export function hasCachedProducts(): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    const expiryTime = localStorage.getItem(CACHE_EXPIRY_KEY)
    if (!expiryTime) return false
    
    const expiryTimeNum = parseInt(expiryTime, 10)
    return expiryTimeNum > Date.now() && !!localStorage.getItem(CACHE_KEY)
  } catch (error) {
    console.error('Error checking cached products:', error)
    return false
  }
}

/**
 * Gets products from cache
 */
export function getCachedProducts(): Product[] | null {
  if (typeof window === 'undefined' || !hasCachedProducts()) return null
  
  try {
    const cachedData = localStorage.getItem(CACHE_KEY)
    return cachedData ? JSON.parse(cachedData) as Product[] : null
  } catch (error) {
    console.error('Error retrieving cached products:', error)
    return null
  }
}

/**
 * Saves products to cache
 */
export function cacheProducts(products: Product[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(products))
    localStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString())
  } catch (error) {
    console.error('Error caching products:', error)
  }
}

/**
 * Clears the product cache
 */
export function clearProductCache(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(CACHE_KEY)
    localStorage.removeItem(CACHE_EXPIRY_KEY)
  } catch (error) {
    console.error('Error clearing product cache:', error)
  }
}

/**
 * Gets the time remaining until cache expiry in a formatted string
 */
export function getCacheExpiryTime(): string | null {
  if (typeof window === 'undefined' || !hasCachedProducts()) return null
  
  try {
    const expiryTime = localStorage.getItem(CACHE_EXPIRY_KEY)
    if (!expiryTime) return null
    
    const expiryTimeNum = parseInt(expiryTime, 10)
    const timeRemaining = expiryTimeNum - Date.now()
    
    // Convert to hours and minutes
    const hours = Math.floor(timeRemaining / (60 * 60 * 1000))
    const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000))
    
    return `${hours}h ${minutes}m`
  } catch (error) {
    console.error('Error getting cache expiry time:', error)
    return null
  }
} 