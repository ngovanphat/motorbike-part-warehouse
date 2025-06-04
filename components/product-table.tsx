"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/components/cart-provider"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { getProducts } from "@/lib/product-service"
import type { Product } from "@/types/product"
import { Search, Plus, AlertCircle, RefreshCw, Save, Trash2 } from "lucide-react"
import { formatCurrency, textMatchesSearch } from "@/lib/utils"
import { clearProductCache, getCacheExpiryTime, hasCachedProducts } from "@/lib/cache-utils"

export function ProductTable() {
  const { addItem } = useCart()
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFromCache, setIsFromCache] = useState(false)
  const [cacheExpiry, setCacheExpiry] = useState<string | null>(null)

  const loadProducts = async (forceRefresh = false) => {
    try {
      setLoading(true)
      setError(null)
      
      // If we're forcing a refresh, clear the cache
      if (forceRefresh) {
        clearProductCache()
      }
      
      // Check if we have data in the cache before making the API call
      const hadCache = hasCachedProducts()
      
      const data = await getProducts()
      setProducts(data)
      
      // Check if the data came from cache after the API call
      const cacheWasUsed = hasCachedProducts() && hadCache && !forceRefresh
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

  useEffect(() => {
    loadProducts()
  }, [t])

  const handleRefresh = () => {
    loadProducts(true)
  }

  const clearCache = () => {
    clearProductCache()
    toast({
      title: t("cacheCleared"),
      description: t("productCacheCleared"),
      duration: 3000,
    })
    // Reload products after clearing cache
    loadProducts(true)
  }

  const filteredProducts = products.filter(
    (product) =>
      textMatchesSearch(product.name, searchQuery) ||
      textMatchesSearch(product.description, searchQuery)
  )

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast({
        title: t("outOfStock"),
        description: `${product.name} ${t("outOfStock").toLowerCase()}.`,
        variant: "destructive",
        duration: 2000,
      })
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      priceOfBatch: product.priceOfBatch,
      image: product.image,
      unit: product.unit,
    })

    toast({
      title: t("addToCart"),
      description: `${product.name} ${t("addToCart").toLowerCase()}.`,
      duration: 2000,
    })
  }

  const getStockStatus = (stock: number) => {
    if (stock <= 0) return { label: t("outOfStock"), className: "text-red-500 font-medium" }
    if (stock <= 5) return { label: t("lowStock"), className: "text-amber-500 font-medium" }
    return { label: t("inStock"), className: "text-green-600 font-medium" }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-3">{t("loading")}</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("searchProducts")}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleRefresh} 
          title={t("refresh")}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        {/* Only show in development mode */}
        {process.env.NODE_ENV === 'development' && (
          <Button 
            variant="outline" 
            size="icon"
            onClick={clearCache}
            title={t("clearCache")}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isFromCache && (
        <div className="text-xs text-blue-500 flex items-center">
          <Save className="h-3 w-3 mr-1" />
          {t("usingCachedData")} {cacheExpiry && `(${t("expires")}: ${cacheExpiry})`}
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-4 text-destructive">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 mr-2" />
            <span>{error}</span>
          </div>
          <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            {t("tryAgain")}
          </Button>
        </div>
      )}

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">{t("id")}</TableHead>
              <TableHead>{t("productName")}</TableHead>
              <TableHead>{t("description")}</TableHead>
              <TableHead className="text-right">{t("price")}</TableHead>
              <TableHead className="text-right">{t("priceOfBatch")}</TableHead>
              <TableHead className="text-center">{t("stock")}</TableHead>
              <TableHead className="text-center">{t("unit")}</TableHead>
              <TableHead className="w-[100px] text-center">{t("action")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  {t("noProductsFound")}
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock)
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{product.description}</TableCell>
                    <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(product.priceOfBatch)}</TableCell>
                    <TableCell className="text-center">
                      <span className={stockStatus.className}>
                        {product.stock} ({stockStatus.label})
                      </span>
                    </TableCell>
                    <TableCell className="text-center">{product.unit}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAddToCart(product)}
                        title={t("addToCart")}
                        disabled={product.stock <= 0}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
