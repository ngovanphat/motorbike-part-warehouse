"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/cart-provider"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Printer, ShoppingBag, Home, Plus, Minus, Search, Save, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { getProducts } from "@/lib/product-service"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/types/product"
import { formatCurrency, textMatchesSearch } from "@/lib/utils"
import { hasCachedProducts, getCacheExpiryTime } from "@/lib/cache-utils"

export default function CheckoutPage() {
  const { items, clearCart, addItem, updateQuantity, removeItem, togglePriceType } = useCart()
  const { t } = useLanguage()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({})
  const [invoiceVisible, setInvoiceVisible] = useState(false)
  const invoiceRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isFromCache, setIsFromCache] = useState(false)
  const [cacheExpiry, setCacheExpiry] = useState<string | null>(null)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [customDiscountInput, setCustomDiscountInput] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const RECOMMENDED_DISCOUNTS = [10000, 20000, 50000, 100000] // Assuming fixed currency amounts

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Check if we have data in the cache before making the API call
        const hadCache = hasCachedProducts()
        
        const data = await getProducts()
        setProducts(data)
        
        // Check if the data came from cache
        const cacheWasUsed = hasCachedProducts() && hadCache
        setIsFromCache(cacheWasUsed)
        
        if (cacheWasUsed) {
          const expiryTime = getCacheExpiryTime()
          setCacheExpiry(expiryTime)
          
          toast({
            title: t("dataFromCache"),
            description: t("usingCachedProductData"),
            duration: 3000,
            className: "bg-blue-50"
          })
        }
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
      priceOfBatch: product.priceOfBatch,
      image: product.image,
    })
  }

  // Get the effective price based on useBatchPrice flag
  const getEffectivePrice = (item: (typeof items)[0]) => {
    return item.useBatchPrice ? item.priceOfBatch : item.price
  }

  // Calculate totals
  const subtotal = items
    .filter(item => selectedItems[item.id])
    .reduce((sum, item) => sum + getEffectivePrice(item) * item.quantity, 0)

  const finalTotal = Math.max(0, subtotal - discountAmount)

  const handleRecommendedDiscountClick = (amount: number) => {
    setDiscountAmount(amount)
    setCustomDiscountInput("")
  }

  const handleCustomDiscountInputChange = (value: string) => {
    setCustomDiscountInput(value)
  }

  const handleApplyCustomDiscount = () => {
    const parsedDiscount = parseFloat(customDiscountInput)
    if (!isNaN(parsedDiscount) && parsedDiscount > 0) {
      if (parsedDiscount > subtotal) {
        toast({
          title: "Discount Too High",
          description: "Discount cannot exceed subtotal.",
          variant: "destructive",
          duration: 3000,
        })
        setDiscountAmount(subtotal) // Apply maximum possible discount
        setCustomDiscountInput(subtotal.toString())
      } else {
        setDiscountAmount(parsedDiscount)
      }
    } else {
      toast({
        title: "Invalid Discount",
        description: "Please enter a valid positive number for the discount.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const handleClearDiscount = () => {
    setDiscountAmount(0)
    setCustomDiscountInput("")
  }

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
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
                  color: #0f172a;
                  line-height: 1.5;
                }
                .invoice-container { 
                  max-width: 800px; 
                  margin: 0 auto; 
                  padding: 20px; 
                  background-color: white;
                }
                .invoice-header {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 2rem;
                }
                .invoice-title {
                  font-size: 1.5rem;
                  font-weight: bold;
                }
                .invoice-id {
                  color: #64748b;
                }
                .store-info {
                  text-align: right;
                }
                .store-name {
                  font-size: 1.25rem;
                  font-weight: bold;
                }
                .store-detail {
                  color: #64748b;
                }
                table { 
                  width: 100%; 
                  border-collapse: collapse; 
                  margin: 1.5rem 0;
                }
                th, td { 
                  padding: 0.75rem; 
                  text-align: left; 
                  border-bottom: 1px solid #e2e8f0; 
                }
                th { 
                  font-weight: 600; 
                  background-color: #f8fafc; 
                }
                .text-right { 
                  text-align: right; 
                }
                .batch-pricing {
                  display: inline-block;
                  background-color: rgba(99, 102, 241, 0.1);
                  color: rgb(99, 102, 241);
                  padding: 0.125rem 0.5rem;
                  border-radius: 9999px;
                  font-size: 0.75rem;
                  margin-left: 0.5rem;
                }
                .summary {
                  display: flex;
                  justify-content: flex-end;
                  margin-bottom: 2rem;
                }
                .summary-content {
                  width: 16rem;
                }
                .summary-row {
                  display: flex;
                  justify-content: space-between;
                  padding: 0.5rem 0;
                  border-top: 1px solid #e2e8f0;
                }
                .discount-row {
                  color: #dc2626;
                }
                .total-row {
                  font-weight: bold;
                  font-size: 1.25rem;
                  border-top: 1px solid #e2e8f0;
                }
                .footer {
                  border-top: 1px solid #e2e8f0;
                  padding-top: 2rem;
                  text-align: center;
                  color: #64748b;
                }
                .bank-info {
                  margin-top: 1.5rem;
                  border-top: 1px solid #e2e8f0;
                  padding-top: 1rem;
                }
                .bank-info p {
                  margin: 0.25rem 0;
                }
              </style>
            </head>
            <body>
              <div class="invoice-container">
                <div class="invoice-header">
                  <div>
                    <div class="invoice-title">${t("invoice")}</div>
                    <div class="invoice-id">#INV-${Date.now()}</div>
                  </div>
                  <div class="store-info">
                    <div class="store-name">${t("storeName")}</div>
                    <div class="store-detail">${t("storeAddress")}</div>
                    <div class="store-detail">${t("storeCity")}</div>
                    <div class="store-detail">${t("storePhone")}</div>
                  </div>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>${t("item")}</th>
                      <th class="text-right">${t("quantity")}</th>
                      <th class="text-right">${t("price")}</th>
                      <th class="text-right">${t("total")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${items
                      .filter(item => selectedItems[item.id])
                      .map((item) => `
                        <tr>
                          <td>
                            ${item.name}
                            ${item.useBatchPrice ? `<span class="batch-pricing">${t("batchPricing")}</span>` : ''}
                          </td>
                          <td class="text-right">${item.quantity}</td>
                          <td class="text-right">${formatCurrency(getEffectivePrice(item))}</td>
                          <td class="text-right">${formatCurrency(getEffectivePrice(item) * item.quantity)}</td>
                        </tr>
                      `).join('')}
                  </tbody>
                </table>

                <div class="summary">
                  <div class="summary-content">
                    <div class="summary-row">
                      <span>${t("subtotal")}</span>
                      <span>${formatCurrency(subtotal)}</span>
                    </div>
                    ${discountAmount > 0 ? `
                      <div class="summary-row discount-row">
                        <span>${t("discount")}</span>
                        <span>-${formatCurrency(discountAmount)}</span>
                      </div>
                    ` : ''}
                    <div class="summary-row total-row">
                      <span>${t("total")}:</span>
                      <span>${formatCurrency(finalTotal)}</span>
                    </div>
                  </div>
                </div>

                <div class="footer">
                  <p>${t("thankYou")}</p>
                  <p>${t("contactSupport")}</p>
                  
                  <div class="bank-info">
                    <p><strong>${t("bankDetails") || "Bank Details"}</strong></p>
                    <p>${t("bankName") || "Bank Name"}: ACB</p>
                    <p>${t("accountNumber") || "Account Number"}: 3761487</p>
                    <p>${t("accountOwner") || "Account Owner"}: LE THI NHU UYEN</p>
                  </div>
                </div>
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

  const saveInvoiceToSupabase = async () => {
    const invoiceNumber = `INV-${Date.now()}`
    const currentDate = new Date().toISOString().split('T')[0] // Format as YYYY-MM-DD
    
    // Filter out unselected items
    const selectedItemsData = items
      .filter(item => selectedItems[item.id])
      .map(item => ({
        id: item.id,
        name: item.name,
        price: getEffectivePrice(item),
        quantity: item.quantity,
        total: getEffectivePrice(item) * item.quantity,
        useBatchPrice: item.useBatchPrice
      }))
    
    const invoiceData = {
      invoice_number: invoiceNumber,
      date: currentDate,
      customer: "Guest", // Could be replaced with actual customer data if available
      items: selectedItemsData,
      discount: discountAmount,
      total_amount: finalTotal
    }
    
    const { data, error } = await supabase
      .from('invoices')
      .insert(invoiceData)
    
    if (error) {
      throw new Error(error.message)
    }
    
    return { invoiceNumber, data }
  }

  const resetPageState = () => {
    clearCart()
    setSelectedItems({})
    setInvoiceVisible(false)
    setSearchQuery("")
    setDiscountAmount(0)
    setCustomDiscountInput("")
  }

  const handleFinish = async () => {
    try {
      setIsSaving(true)
      
      // Save invoice to Supabase
      const { invoiceNumber } = await saveInvoiceToSupabase()
      
      // Reset page state without navigation
      resetPageState()
      
      // Show success message
      toast({
        title: "Invoice Saved",
        description: `Invoice number: ${invoiceNumber}`,
        duration: 5000,
      })
    } catch (error: any) {
      console.error("Error saving invoice:", error)
      toast({
        title: "Error Saving Invoice",
        description: error.message || "Please try again",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Filter products for the product selector
  const filteredProducts = products.filter(
    (product) =>
      textMatchesSearch(product.name, searchQuery) ||
      textMatchesSearch(product.description, searchQuery),
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
                <p className="text-gray-500">{t("storePhone")}</p>
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
                        {item.useBatchPrice && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {t("batchPricing")}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-right">{item.quantity}</td>
                    <td className="py-4 text-right">{formatCurrency(getEffectivePrice(item))}</td>
                    <td className="py-4 text-right">{formatCurrency(getEffectivePrice(item) * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mb-8">
              <div className="w-64">
                <div className="flex justify-between py-2 border-t border-gray-300">
                  <span>{t("subtotal")}</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between py-2 text-red-600">
                    <span>{t("discount")}</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 font-bold text-lg border-t border-gray-300">
                  <span className="mr-2">{t("total")}:</span>
                  <span>{formatCurrency(finalTotal)}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-8 text-center text-gray-500">
              <p>{t("thankYou")}</p>
              <p className="mt-2">{t("contactSupport")}</p>
              
              {/* Bank information */}
              <div className="mt-4 border-t border-gray-200 pt-4 text-left">
                <p className="font-medium">{t("bankDetails") || "Bank Details"}</p>
                <p className="mt-1">{t("bankName") || "Bank Name"}: ACB</p>
                <p>{t("accountNumber") || "Account Number"}: 3761487</p>
                <p>{t("accountOwner") || "Account Owner"}: LE THI NHU UYEN</p>
              </div>
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
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                t("finishShopping")
              )}
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
            {isFromCache && (
              <div className="text-xs text-blue-500 flex items-center mt-2">
                <Save className="h-3 w-3 mr-1" />
                {t("usingCachedData")} {cacheExpiry && `(${t("expires")}: ${cacheExpiry})`}
              </div>
            )}
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
                    <div className="flex text-sm text-muted-foreground">
                      <span>{formatCurrency(product.price)}</span>
                      <span className="mx-1">|</span>
                      <span className="text-primary">{t("batchPricing")}: {formatCurrency(product.priceOfBatch)}</span>
                    </div>
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
                    <TableHead className="text-center w-[180px]">{t("batchPricing")}</TableHead>
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
                      <TableCell className="text-right">
                        {item.useBatchPrice ? (
                          <span className="text-muted-foreground line-through">
                            {formatCurrency(item.price)}
                          </span>
                        ) : (
                          <span className="font-medium">
                            {formatCurrency(item.price)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Switch
                            checked={item.useBatchPrice}
                            onCheckedChange={() => togglePriceType(item.id)}
                            aria-label={item.useBatchPrice ? t("useBatchPrice") : t("useRegularPrice")}
                          />
                          <span className={item.useBatchPrice ? "font-medium" : "text-muted-foreground"}>
                            {formatCurrency(item.priceOfBatch)}
                          </span>
                        </div>
                      </TableCell>
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
                      <TableCell className="text-right">
                        {formatCurrency(getEffectivePrice(item) * item.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="p-4 space-y-3 border-t bg-muted/30">
                <div className="flex justify-between font-medium">
                  <span>{t("subtotal")}</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                {/* Discount Section Start */}
                <div className="space-y-2 pt-3">
                  <h4 className="font-medium text-sm text-muted-foreground">{t("applyDiscount") || "Apply Discount"}</h4>
                  <div className="flex gap-2 flex-wrap">
                    {RECOMMENDED_DISCOUNTS.map((amount) => (
                      <Button 
                        key={amount} 
                        variant={discountAmount === amount ? "default" : "outline"} 
                        size="sm"
                        onClick={() => handleRecommendedDiscountClick(amount)}
                        disabled={subtotal === 0}
                      >
                        {formatCurrency(amount)}
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-2 items-center">
                    <Input 
                      type="number" 
                      placeholder={t("customDiscountPlaceholder") || "Enter custom discount"} 
                      value={customDiscountInput} 
                      onChange={(e) => handleCustomDiscountInputChange(e.target.value)}
                      className="max-w-[200px]"
                      min="0"
                      disabled={subtotal === 0}
                    />
                    <Button onClick={handleApplyCustomDiscount} size="sm" disabled={!customDiscountInput || subtotal === 0}>{t("apply") || "Apply"}</Button>
                    {discountAmount > 0 && (
                      <Button onClick={handleClearDiscount} variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                        {t("clearDiscount") || "Clear"}
                      </Button>
                    )}
                  </div>
                </div>
                {/* Discount Section End */}

                {discountAmount > 0 && (
                  <div className="flex justify-between text-red-600 pt-2">
                    <span>{t("discount")}</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between font-medium text-lg pt-2 border-t mt-2">
                  <span>{t("total")}</span>
                  <span>{formatCurrency(finalTotal)}</span>
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
