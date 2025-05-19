"use client"

import { useState, useEffect, useRef } from "react"
import { useLanguage } from "@/components/language-provider"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { formatCurrency } from "@/lib/utils"
import { Search, Eye, Printer } from "lucide-react"

interface Invoice {
  id: string
  invoice_number: string
  date: string
  customer: string
  total_amount: number
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    total: number
    useBatchPrice: boolean
  }>
  discount: number
  created_at: string
}

export default function InvoicesPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const invoiceDetailRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        
        setInvoices(data || [])
      } catch (err: any) {
        console.error("Error fetching invoices:", err)
        setError(err.message || "Failed to load invoices")
      } finally {
        setLoading(false)
      }
    }
    
    fetchInvoices()
  }, [])
  
  // Filter invoices based on search query
  const filteredInvoices = invoices.filter(invoice => 
    invoice.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.customer.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const handleViewInvoice = async (invoiceId: string) => {
    try {
      // Fetch the full invoice details
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', invoiceId)
        .single()
      
      if (error) throw error
      
      setSelectedInvoice(data)
      setIsDialogOpen(true)
    } catch (err: any) {
      console.error("Error fetching invoice details:", err)
      // You could show a toast error here
    }
  }
  
  const handlePrintInvoice = async (invoiceId: string) => {
    try {
      // First fetch the invoice if not already selected
      if (!selectedInvoice || selectedInvoice.id !== invoiceId) {
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .eq('id', invoiceId)
          .single()
        
        if (error) throw error
        setSelectedInvoice(data)
      }
      
      // Get the invoice to print - either the one we just fetched or the one already selected
      const invoiceToPrint = selectedInvoice?.id === invoiceId ? selectedInvoice : await supabase
        .from('invoices')
        .select('*')
        .eq('id', invoiceId)
        .single()
        .then(res => res.data)
      
      if (!invoiceToPrint) throw new Error("Could not find invoice")
      
      // Open a new window for printing
      const originalTitle = document.title
      document.title = `${t("invoice") || "Invoice"} #${invoiceToPrint.invoice_number}`

      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${t("invoice") || "Invoice"} #${invoiceToPrint.invoice_number}</title>
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
              </style>
            </head>
            <body>
              <div class="invoice-container">
                <div class="invoice-header">
                  <div>
                    <div class="invoice-title">${t("invoice") || "Invoice"}</div>
                    <div class="invoice-id">#${invoiceToPrint.invoice_number}</div>
                  </div>
                  <div class="store-info">
                    <div class="store-name">${t("storeName") || "Motorbike Warehouse"}</div>
                    <div class="store-detail">${t("storeAddress") || "123 Main Street"}</div>
                    <div class="store-detail">${t("storeCity") || "City, Country"}</div>
                    <div class="store-detail">${t("storePhone") || "+1 234 567 890"}</div>
                  </div>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>${t("item") || "Item"}</th>
                      <th class="text-right">${t("quantity") || "Quantity"}</th>
                      <th class="text-right">${t("price") || "Price"}</th>
                      <th class="text-right">${t("total") || "Total"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${invoiceToPrint.items.map((item: any) => `
                      <tr>
                        <td>
                          ${item.name}
                          ${item.useBatchPrice ? `<span class="batch-pricing">${t("batchPricing") || "Batch Pricing"}</span>` : ''}
                        </td>
                        <td class="text-right">${item.quantity}</td>
                        <td class="text-right">${formatCurrency(item.price)}</td>
                        <td class="text-right">${formatCurrency(item.total)}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>

                <div class="summary">
                  <div class="summary-content">
                    <div class="summary-row">
                      <span>${t("subtotal") || "Subtotal"}</span>
                      <span>${formatCurrency(invoiceToPrint.total_amount + (invoiceToPrint.discount || 0))}</span>
                    </div>
                    ${invoiceToPrint.discount ? `
                      <div class="summary-row discount-row">
                        <span>${t("discount") || "Discount"}</span>
                        <span>-${formatCurrency(invoiceToPrint.discount)}</span>
                      </div>
                    ` : ''}
                    <div class="summary-row total-row">
                      <span>${t("total") || "Total"}:</span>
                      <span>${formatCurrency(invoiceToPrint.total_amount)}</span>
                    </div>
                  </div>
                </div>

                <div class="footer">
                  <p>${t("thankYou") || "Thank you for your business!"}</p>
                  <p>${t("contactSupport") || "For any issues, please contact our support team."}</p>
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
    } catch (err: any) {
      console.error("Error printing invoice:", err)
      // You could show a toast error here
    }
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-3">{t("loading") || "Loading..."}</span>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="flex flex-col items-center justify-center py-4 text-destructive">
          <p className="mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            {t("tryAgain") || "Try Again"}
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("invoices") || "Invoices"}</h1>
      
      <div className="mb-6 relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t("searchInvoices") || "Search invoices..."}
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("invoiceNumber") || "Invoice Number"}</TableHead>
              <TableHead>{t("date") || "Date"}</TableHead>
              <TableHead>{t("customer") || "Customer"}</TableHead>
              <TableHead className="text-right">{t("total") || "Total"}</TableHead>
              <TableHead className="text-right">{t("actions") || "Actions"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {searchQuery ? t("noInvoicesFound") || "No invoices found" : t("noInvoicesYet") || "No invoices yet"}
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                  <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                  <TableCell>{invoice.customer}</TableCell>
                  <TableCell className="text-right">{formatCurrency(invoice.total_amount)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleViewInvoice(invoice.id)}
                        aria-label={t("viewInvoice") || "View Invoice"}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handlePrintInvoice(invoice.id)}
                        aria-label={t("printInvoice") || "Print Invoice"}
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Invoice Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" ref={invoiceDetailRef}>
          <DialogHeader>
            <DialogTitle>
              {t("invoice") || "Invoice"} #{selectedInvoice?.invoice_number}
            </DialogTitle>
          </DialogHeader>
          
          {selectedInvoice && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">{t("date") || "Date"}: {new Date(selectedInvoice.date).toLocaleDateString()}</p>
                  <p className="text-sm text-muted-foreground">{t("customer") || "Customer"}: {selectedInvoice.customer}</p>
                </div>
                <div className="text-right">
                  <h2 className="font-bold">{t("storeName") || "Motorbike Warehouse"}</h2>
                  <p className="text-sm text-muted-foreground">{t("storeAddress") || "123 Main Street"}</p>
                  <p className="text-sm text-muted-foreground">{t("storeCity") || "City, Country"}</p>
                </div>
              </div>
              
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">{t("item") || "Item"}</th>
                    <th className="py-2 text-right">{t("quantity") || "Quantity"}</th>
                    <th className="py-2 text-right">{t("price") || "Price"}</th>
                    <th className="py-2 text-right">{t("total") || "Total"}</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">
                        <div className="flex items-center gap-3">
                          <span>{item.name}</span>
                          {item.useBatchPrice && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              {t("batchPricing") || "Batch Pricing"}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2 text-right">{item.quantity}</td>
                      <td className="py-2 text-right">{formatCurrency(item.price)}</td>
                      <td className="py-2 text-right">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between py-2 border-t">
                    <span>{t("subtotal") || "Subtotal"}</span>
                    <span>{formatCurrency(selectedInvoice.total_amount + (selectedInvoice.discount || 0))}</span>
                  </div>
                  {selectedInvoice.discount > 0 && (
                    <div className="flex justify-between py-2 text-red-600">
                      <span>{t("discount") || "Discount"}</span>
                      <span>-{formatCurrency(selectedInvoice.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 font-bold text-lg border-t">
                    <span>{t("total") || "Total"}:</span>
                    <span>{formatCurrency(selectedInvoice.total_amount)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              {t("close") || "Close"}
            </Button>
            <Button 
              onClick={() => selectedInvoice && handlePrintInvoice(selectedInvoice.id)}
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              {t("printInvoice") || "Print Invoice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}