import type { Product } from "@/types/product"
import { fetchProductsAction } from "@/lib/actions"

/**
 * Client-side wrapper for the server action to fetch products
 * This function doesn't access any environment variables directly
 */
export async function fetchProductsFromGoogleSheets(): Promise<Product[]> {
  try {
    return await fetchProductsAction()
  } catch (error) {
    console.error("Error fetching products from Google Sheets:", error)
    throw error
  }
}
