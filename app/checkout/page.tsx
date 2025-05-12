"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/cart-provider"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Printer, ShoppingBag, Home, Plus, Minus, Search } from "lucide-react"
import { getProducts } from "@/lib/product-service"
import type { Product } from "@/types/product"
import { formatCurrency } from "@/lib/utils"

export default function CheckoutPage() {
  const { items, clearCart, addItem, updateQuantity, removeItem } = useCart()
  const { t } = useLanguage()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({})
  const [invoiceVisible, setInvoiceVisible] = useState(false)
  const invoiceRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getProducts()
        setProducts(data)
      } catch (err: any) {
        console.error("Error fetching products:", err)
        setError(t("loadingError"))
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [t])

  // Initialize selected items based on cart items
  useEffect(() => {
    const initialSelected = items.reduce((acc, item) => {
      acc[item.id] = true
      return acc
    }, {} as Record<string, boolean>)
    setSelectedItems(initialSelected)
  }, [items])

  const handleItemSelect = (id: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }
    updateQuantity(id, newQuantity)
  }

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
  }

  // Calculate totals
  const total = items
    .filter(item => selectedItems[item.id])
    .reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handlePrintInvoice = () => {
    if (invoiceRef.current) {
      const originalTitle = document.title
      document.title = `${t("invoice")} #INV-${Date.now()}`

      // Create a new window for printing
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${t("invoice")} #INV-${Date.now()}</title>
              <style>
                body { font-family: Arial, sans-serif; }
                .invoice-container { max-width: 800px; margin: 0 auto; padding: 20px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background-color: #f8f9fa; }
                .text-right { text-align: right; }
                .total-row { font-weight: bold; }
              </style>
            </head>
            <body>
              <div class="invoice-container">
                ${invoiceRef.current.innerHTML}
              </div>
            </body>
          </html>
        `)
        printWindow.document.close()

        // Print after resources are loaded
        printWindow.onload = () => {
          printWindow.focus()
          printWindow.print()
          printWindow.onafterprint = () => {
            printWindow.close()
            document.title = originalTitle
          }
        }
      }
    }
  }

  const handleFinish = () => {
    clearCart()
    router.push("/")
  }

  // Filter products for the product selector
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-3">{t("loading")}</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="flex flex-col items-center justify-center py-4 text-destructive">
          <p className="mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            {t("tryAgain")}
          </Button>
        </div>
      </div>
    )
  }

  if (invoiceVisible) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t("checkout")}</h1>
        
        <div className="space-y-6">
          <div className="p-6 border rounded-lg bg-white" ref={invoiceRef}>
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-2xl font-bold">{t("invoice")}</h1>
                <p className="text-gray-500">#{`INV-${Date.now()}`}</p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold">{t("storeName")}</h2>
                <p className="text-gray-500">{t("storeAddress")}</p>
                <p className="text-gray-500">{t("storeCity")}</p>
                <p className="text-gray-500">{t("storeEmail")}</p>
              </div>
            </div>

            <table className="w-full mb-8">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="py-2 text-left">{t("item")}</th>
                  <th className="py-2 text-right">{t("quantity")}</th>
                  <th className="py-2 text-right">{t("price")}</th>
                  <th className="py-2 text-right">{t("total")}</th>
                </tr>
              </thead>
              <tbody>
                {items
                  .filter(item => selectedItems[item.id])
                  .map((item) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-right">{item.quantity}</td>
                    <td className="py-4 text-right">{formatCurrency(item.price)}</td>
                    <td className="py-4 text-right">{formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mb-8">
              <div className="w-64">
                <div className="flex justify-between py-2 font-bold text-lg border-t border-gray-300">
                  <span>{t("total")}:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-8 text-center text-gray-500">
              <p>{t("thankYou")}</p>
              <p className="mt-2">{t("contactSupport")}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-end gap-4">
            <Button 
              onClick={() => setInvoiceVisible(false)} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              {t("backToProducts")}
            </Button>
            <Button 
              onClick={handlePrintInvoice} 
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              {t("printInvoice")}
            </Button>
            <Button 
              onClick={handleFinish} 
              variant="default"
            >
              {t("finishShopping")}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("checkout")}</h1>

      <div className="grid grid-cols-1 gap-8">
        <div className="border rounded-lg overflow-hidden">
          <div className="p-4 bg-muted/50">
            <h3 className="font-medium">{items.length === 0 ? t("addProductsBeforeCheckout") : t("yourCart")}</h3>
          </div>

          <div className="p-4 border-b">
            <div className="mb-4 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("searchProducts")}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
              {filteredProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-3 p-2 border rounded-md">
                  <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 truncate">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{formatCurrency(product.price)}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock <= 0}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          {items.length > 0 && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]"></TableHead>
                    <TableHead className="w-[80px]">{t("id")}</TableHead>
                    <TableHead>{t("productName")}</TableHead>
                    <TableHead className="text-right">{t("price")}</TableHead>
                    <TableHead className="text-center">{t("quantity")}</TableHead>
                    <TableHead className="text-right">{t("total")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedItems[item.id]} 
                          onCheckedChange={() => handleItemSelect(item.id)}
                          aria-label={`Select ${item.name}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                            <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                          </div>
                          <span>{item.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8" 
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                            className="w-16 mx-1 text-center"
                            min="1"
                          />
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8" 
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(item.price * item.quantity)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="p-4 space-y-3 border-t bg-muted/30">
                <div className="flex justify-between font-medium text-lg">
                  <span>{t("total")}</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-end gap-4">
          <Button 
            onClick={() => router.push("/")} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <ShoppingBag className="h-4 w-4" />
            {t("continueShopping")}
          </Button>
          {items.length > 0 && (
            <Button 
              onClick={() => setInvoiceVisible(true)} 
              className="flex items-center gap-2"
              disabled={!Object.values(selectedItems).some(v => v)}
            >
              <Printer className="h-4 w-4" />
              {t("printInvoice")}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
