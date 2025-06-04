import { Product } from "@/types/product"
import { fetchProductsAction } from "@/lib/actions"
import { getCachedProducts, cacheProducts } from "./cache-utils"

// Fallback mock data
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    description:
      "Premium noise-cancelling wireless headphones with 30-hour battery life and comfortable over-ear design.",
    price: 199.99,
    priceOfBatch: 179.99,
    stock: 15,
    image: "/placeholder.svg?height=400&width=400",
    unit: "cái"
  },
  {
    id: "2",
    name: "Smartphone",
    description:
      "Latest model smartphone with high-resolution display, powerful processor, and advanced camera system.",
    price: 899.99,
    priceOfBatch: 829.99,
    stock: 8,
    image: "/placeholder.svg?height=400&width=400",
    unit: "cái"
  },
  {
    id: "3",
    name: "Laptop",
    description:
      "Ultra-thin laptop with 16GB RAM, 512GB SSD, and 14-inch 4K display for productivity and entertainment.",
    price: 1299.99,
    priceOfBatch: 1199.99,
    stock: 5,
    image: "/placeholder.svg?height=400&width=400",
    unit: "cái"
  },
  {
    id: "4",
    name: "Smartwatch",
    description: "Fitness and health tracking smartwatch with heart rate monitor, GPS, and 7-day battery life.",
    price: 249.99,
    priceOfBatch: 219.99,
    stock: 20,
    image: "/placeholder.svg?height=400&width=400",
    unit: "cái"
  },
  {
    id: "5",
    name: "Wireless Earbuds",
    description: "True wireless earbuds with active noise cancellation, water resistance, and compact charging case.",
    price: 149.99,
    priceOfBatch: 129.99,
    stock: 12,
    image: "/placeholder.svg?height=400&width=400",
    unit: "cái"
  },
  {
    id: "6",
    name: "Tablet",
    description: "10.2-inch tablet with retina display, powerful chip, and all-day battery life for work and play.",
    price: 329.99,
    priceOfBatch: 299.99,
    stock: 0,
    image: "/placeholder.svg?height=400&width=400",
    unit: "cái"
  },
  {
    id: "7",
    name: "Digital Camera",
    description: "Mirrorless digital camera with 24.2MP sensor, 4K video recording, and interchangeable lens system.",
    price: 799.99,
    priceOfBatch: 749.99,
    stock: 3,
    image: "/placeholder.svg?height=400&width=400",
    unit: "cái"
  },
  {
    id: "8",
    name: "Portable Speaker",
    description:
      "Waterproof Bluetooth speaker with 360° sound, 24-hour battery life, and built-in microphone for calls.",
    price: 129.99,
    priceOfBatch: 109.99,
    stock: 18,
    image: "/placeholder.svg?height=400&width=400",
    unit: "cái"
  },
  {
    id: "9",
    name: "Gaming Console",
    description: "Next-generation gaming console with 1TB storage, 4K gaming, and access to hundreds of games.",
    price: 499.99,
    priceOfBatch: 469.99,
    stock: 2,
    image: "/placeholder.svg?height=400&width=400",
    unit: "cái"
  },
  {
    id: "10",
    name: "Smart Home Hub",
    description: "Central hub for controlling all your smart home devices with voice commands and automation features.",
    price: 129.99,
    priceOfBatch: 109.99,
    stock: 7,
    image: "/placeholder.svg?height=400&width=400",
    unit: "cái"
  },
]

// Flag to control whether to use Google Sheets or mock data
const USE_GOOGLE_SHEETS = true

const CACHE_KEY = 'cached_products'
const CACHE_EXPIRY_KEY = 'cached_products_expiry'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

/**
 * Fetches products from Google Sheets or falls back to mock data
 */
export async function getProducts(): Promise<Product[]> {
  // Check if we have cached products and if they're still valid
  const cachedProducts = getCachedProducts()
  if (cachedProducts) {
    console.log("Using cached product data")
    return cachedProducts
  }

  if (!USE_GOOGLE_SHEETS) {
    console.log("Using mock product data")
    const mockData = mockProducts
    
    // Cache the mock data
    cacheProducts(mockData)
    
    return mockData
  }

  try {
    console.log("Attempting to fetch products from Google Sheets")
    const products = await fetchProductsAction()
    console.log(`Successfully fetched ${products.length} products from Google Sheets`)
    cacheProducts(products)
    return products
  } catch (error) {
    console.error("Failed to fetch from Google Sheets, using mock data:", error)
    return mockProducts
  }
}
