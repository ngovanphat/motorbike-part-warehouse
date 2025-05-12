"use server"

import type { Product } from "@/types/product"

// Google Sheets API configuration - only accessed on the server
const SPREADSHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY // Using the server-side variable
const SHEET_NAME = "products_template" // The name of your sheet
const RANGE = "A2:F100" // Adjust based on your data range
/**
 * Server action to fetch products from Google Sheets
 */
export async function fetchProductsAction(): Promise<Product[]> {
  if (!SPREADSHEET_ID || !API_KEY) {
    throw new Error("Google Sheets API credentials are not configured")
  }

  try {
    // Construct the Google Sheets API URL
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!${RANGE}?key=${API_KEY}`

    // Fetch data from Google Sheets
    const response = await fetch(apiUrl)

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status}`)
    }

    const data = await response.json()
    console.log(data)
    // If no values returned, return empty array
    if (!data.values || data.values.length === 0) {
      return []
    }

    // Parse the response into Product objects
    return parseGoogleSheetsData(data.values)
  } catch (error) {
    console.error("Error fetching data from Google Sheets:", error)
    throw error
  }
}

/**
 * Server action to test spreadsheet metadata
 */
export async function testSpreadsheetMetadata(sheetName = "Products") {
  if (!SPREADSHEET_ID || !API_KEY) {
    throw new Error("Google Sheets API credentials are not configured")
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?key=${API_KEY}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`API error: ${response.status} - ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching spreadsheet metadata:", error)
    throw error
  }
}

/**
 * Server action to test sheet data
 */
export async function testSheetData(sheetName = "Products", range = "A1:F100") {
  if (!SPREADSHEET_ID || !API_KEY) {
    throw new Error("Google Sheets API credentials are not configured")
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}!${range}?key=${API_KEY}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`API error: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()

    // Try to parse products if data exists
    let parsedProducts = []
    if (data.values && data.values.length > 0) {
      parsedProducts = data.values
        .slice(1)
        .map((row: any[]) => {
          if (row.length < 5) return null

          return {
            id: row[0],
            name: row[1],
            description: row[3],
            price: Number.parseFloat(row[2]) || 0,
            stock: Number.parseInt(row[4], 10) || 0,
            image: row[5] || "/placeholder.svg?height=400&width=400",
          }
        })
        .filter(Boolean)
    }

    return {
      rawData: data,
      parsedProducts,
    }
  } catch (error) {
    console.error("Error fetching sheet data:", error)
    throw error
  }
}

/**
 * Parses raw Google Sheets data into Product objects
 */
function parseGoogleSheetsData(rows: string[][]): Product[] {
  return rows
    .filter((row) => row.length >= 5) // Ensure row has enough columns
    .map((row) => {
      // Map each row to a Product object
      return {
        id: row[0],
        name: row[1],
        description: row[3],
        price: Number.parseFloat(row[2]) || 0,
        stock: Number.parseInt(row[4], 10) || 0,
        image: row[5] || "/placeholder.svg?height=400&width=400",
      }
    })
}
