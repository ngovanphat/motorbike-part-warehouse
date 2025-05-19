"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/components/language-provider"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { formatCurrency } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface Invoice {
  id: string
  invoice_number: string
  date: string
  customer: string
  total_amount: number
  created_at: string
}

interface ProductSalesSummary {
  id: string
  name: string
  total_quantity: number
}

interface DailySalesData {
  date: string
  total: number
}

export default function DashboardPage() {
  const { t } = useLanguage()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [dailySales, setDailySales] = useState<DailySalesData[]>([])
  const [productSales, setProductSales] = useState<ProductSalesSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch invoices
        const { data: invoicesData, error: invoicesError } = await supabase
          .from('invoices')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (invoicesError) throw invoicesError
        
        setInvoices(invoicesData || [])
        
        // Calculate daily sales from invoices
        const salesByDay = invoicesData?.reduce((acc: Record<string, number>, invoice: Invoice) => {
          // Extract just the date part
          const dateKey = new Date(invoice.date || invoice.created_at).toISOString().split('T')[0]
          
          if (!acc[dateKey]) {
            acc[dateKey] = 0
          }
          acc[dateKey] += invoice.total_amount || 0
          
          return acc
        }, {})
        
        // Convert to chart data format
        const chartData = Object.keys(salesByDay || {}).map(date => ({
          date,
          total: salesByDay[date]
        })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        
        setDailySales(chartData)
        
        // Calculate product sales summary
        const productQuantities: Record<string, { id: string, name: string, quantity: number }> = {}
        
        invoicesData?.forEach((invoice: any) => {
          if (invoice.items && Array.isArray(invoice.items)) {
            invoice.items.forEach((item: any) => {
              if (!productQuantities[item.id]) {
                productQuantities[item.id] = {
                  id: item.id,
                  name: item.name,
                  quantity: 0
                }
              }
              productQuantities[item.id].quantity += item.quantity || 0
            })
          }
        })
        
        // Convert to array and sort by quantity
        const productSalesSummary = Object.values(productQuantities)
          .map(product => ({
            id: product.id,
            name: product.name,
            total_quantity: product.quantity
          }))
          .sort((a, b) => b.total_quantity - a.total_quantity)
        
        setProductSales(productSalesSummary)
        
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err)
        setError(err.message || "Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [])
  
  // Filter product sales based on search query
  const filteredProductSales = productSales.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("dashboard") || "Dashboard"}</h1>
      
      {/* Daily Sales Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t("dailySales") || "Daily Sales"}</CardTitle>
          <CardDescription>
            {t("totalSalesPerDay") || "Total sales amount per day"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dailySales.length === 0 ? (
            <div className="flex justify-center items-center h-[300px] text-muted-foreground">
              {loading ? (t("loading") || "Loading...") : "No sales data available"}
            </div>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailySales} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    angle={-45} 
                    textAnchor="end" 
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                    className="text-xs"
                  />
                  <YAxis 
                    tickFormatter={(value) => formatCurrency(value)}
                    className="text-xs"
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), t("total") || "Total Sales"]}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                  />
                  <Bar 
                    dataKey="total" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                    className="fill-primary" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Product Sales Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>{t("products") || "Product Sales"}</CardTitle>
              <CardDescription>
                {t("productSummary") || "Summary of quantities sold per product"}
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("searchProducts") || "Search products..."}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("productName") || "Product"}</TableHead>
                  <TableHead className="text-right">{t("quantity") || "Quantity Sold"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderTableContent()}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
  
  function renderTableContent() {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={2} className="h-24 text-center">
            {t("loading") || "Loading..."}
          </TableCell>
        </TableRow>
      )
    }
    
    if (filteredProductSales.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={2} className="h-24 text-center">
            {t("noProductsFound") || "No products found"}
          </TableCell>
        </TableRow>
      )
    }
    
    return filteredProductSales.map((product) => (
      <TableRow key={product.id}>
        <TableCell className="font-medium">{product.name}</TableCell>
        <TableCell className="text-right">{product.total_quantity}</TableCell>
      </TableRow>
    ))
  }
} 