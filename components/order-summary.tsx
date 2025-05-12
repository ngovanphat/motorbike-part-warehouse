"use client"

import Image from "next/image"
import { useLanguage } from "@/components/language-provider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import type { CartItem } from "@/components/cart-provider"

interface OrderSummaryProps {
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
}

export function OrderSummary({ items, subtotal, tax, total }: OrderSummaryProps) {
  const { t } = useLanguage()

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4 bg-muted/50">
        <h3 className="font-medium">{t("orderSummary")}</h3>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="p-4 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  ${item.price.toFixed(2)} x {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 space-y-3 border-t">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t("subtotal")}</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t("tax")} (10%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-medium text-lg">
          <span>{t("total")}</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
