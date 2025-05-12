"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { testSpreadsheetMetadata, testSheetData } from "@/lib/actions"

export function SheetsDebugger() {
  // Sheet parameters
  const [sheetName, setSheetName] = useState("Products")
  const [range, setRange] = useState("A1:F100")

  // Results
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<any>(null)
  const [sheetData, setSheetData] = useState<any>(null)
  const [parsedProducts, setParsedProducts] = useState<any[]>([])

  // Test spreadsheet metadata
  const handleTestMetadata = async () => {
    try {
      setLoading(true)
      setError(null)
      setMetadata(null)

      const data = await testSpreadsheetMetadata(sheetName)
      console.log("Spreadsheet metadata:", data)
      setMetadata(data)
    } catch (err: any) {
      console.error("Error fetching spreadsheet metadata:", err)
      setError(err.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Test sheet data
  const handleTestSheetData = async () => {
    try {
      setLoading(true)
      setError(null)
      setSheetData(null)
      setParsedProducts([])

      const result = await testSheetData(sheetName, range)
      console.log("Sheet data:", result.rawData)
      setSheetData(result.rawData)
      setParsedProducts(result.parsedProducts)
    } catch (err: any) {
      console.error("Error fetching sheet data:", err)
      setError(err.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Google Sheets API Debugger</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sheetName">Sheet Name</Label>
              <Input
                id="sheetName"
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                placeholder="Enter sheet name"
              />
              <p className="text-xs text-muted-foreground">The name of the sheet tab (case-sensitive)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="range">Range</Label>
              <Input
                id="range"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                placeholder="Enter cell range"
              />
              <p className="text-xs text-muted-foreground">The range of cells to fetch (e.g., A1:F100)</p>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md">
              <p>
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}

          <Tabs defaultValue="metadata">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
              <TabsTrigger value="data">Sheet Data</TabsTrigger>
              <TabsTrigger value="products">Parsed Products</TabsTrigger>
            </TabsList>

            <TabsContent value="metadata" className="p-4 border rounded-md mt-2">
              {metadata ? (
                <div className="overflow-auto max-h-60">
                  <h3 className="font-medium mb-2">Available Sheets:</h3>
                  <ul className="list-disc pl-5 mb-4">
                    {metadata.sheets?.map((sheet: any, index: number) => (
                      <li key={index}>
                        {sheet.properties?.title} (ID: {sheet.properties?.sheetId})
                      </li>
                    ))}
                  </ul>
                  <pre className="text-xs bg-gray-100 p-2 rounded">{JSON.stringify(metadata, null, 2)}</pre>
                </div>
              ) : (
                <p className="text-muted-foreground">Click "Test Metadata" to view spreadsheet information</p>
              )}
            </TabsContent>

            <TabsContent value="data" className="p-4 border rounded-md mt-2">
              {sheetData ? (
                <div className="overflow-auto max-h-60">
                  <h3 className="font-medium mb-2">Raw Sheet Data:</h3>
                  <pre className="text-xs bg-gray-100 p-2 rounded">{JSON.stringify(sheetData, null, 2)}</pre>
                </div>
              ) : (
                <p className="text-muted-foreground">Click "Test Sheet Data" to view raw data</p>
              )}
            </TabsContent>

            <TabsContent value="products" className="p-4 border rounded-md mt-2">
              {parsedProducts.length > 0 ? (
                <div className="overflow-auto max-h-60">
                  <h3 className="font-medium mb-2">Parsed Products ({parsedProducts.length}):</h3>
                  <pre className="text-xs bg-gray-100 p-2 rounded">{JSON.stringify(parsedProducts, null, 2)}</pre>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  {sheetData ? "No products could be parsed from the data" : "Test sheet data first to parse products"}
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleTestMetadata} disabled={loading} variant="outline">
          {loading ? "Testing..." : "Test Metadata"}
        </Button>
        <Button onClick={handleTestSheetData} disabled={loading}>
          {loading ? "Testing..." : "Test Sheet Data"}
        </Button>
      </CardFooter>
    </Card>
  )
}
