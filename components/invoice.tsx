"use client"
import { useLanguage } from "@/components/language-provider"
import type { CartItem } from "@/components/cart-provider"

interface InvoiceProps {
  invoice: {
    invoiceNumber: string
    date: string
    customer: {
      name: string
      email: string
      address: string
      city: string
      zipCode: string
      phone: string
    }
    items: CartItem[]
    subtotal: number
    tax: number
    total: number
  }
}

export function Invoice({ invoice }: InvoiceProps) {
  const { t } = useLanguage()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold">{t("invoice")}</h1>
          <p className="text-gray-500">#{invoice.invoiceNumber}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold">{t("storeName")}</h2>
          <p className="text-gray-500">{t("storeAddress")}</p>
          <p className="text-gray-500">{t("storeCity")}</p>
          <p className="text-gray-500">{t("storePhone")}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">{t("billTo")}</h3>
          <p className="font-medium">{invoice.customer.name}</p>
          <p>{invoice.customer.address}</p>
          <p>
            {invoice.customer.city}, {invoice.customer.zipCode}
          </p>
          <p>{invoice.customer.email}</p>
          <p>{invoice.customer.phone}</p>
        </div>
        <div className="text-right">
          <h3 className="font-semibold text-gray-700 mb-2">{t("invoiceDetails")}</h3>
          <p>
            <span className="text-gray-500">{t("date")}</span> {formatDate(invoice.date)}
          </p>
          <p>
            <span className="text-gray-500">{t("paymentMethod")}</span> {t("creditCard")}
          </p>
          <p>
            <span className="text-gray-500">{t("status")}</span>{" "}
            <span className="text-green-600 font-medium">{t("paid")}</span>
          </p>
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
          {invoice.items.map((item) => (
            <tr key={item.id} className="border-b border-gray-200">
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <span>{item.name}</span>
                </div>
              </td>
              <td className="py-4 text-right">{item.quantity}</td>
              <td className="py-4 text-right">${item.price.toFixed(2)}</td>
              <td className="py-4 text-right">${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">{t("subtotal")}:</span>
            <span>${invoice.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">{t("tax")} (10%):</span>
            <span>${invoice.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 font-bold text-lg border-t border-gray-300">
            <span>{t("total")}:</span>
            <span>${invoice.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 pt-8 text-center text-gray-500">
        <p>{t("thankYou")}</p>
        <p className="mt-2">{t("contactSupport")}</p>
      </div>
    </div>
  )
}
