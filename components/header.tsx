"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"

export function Header() {
  const { items } = useCart()
  const { t } = useLanguage()
  const router = useRouter()
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)

  const handleCartClick = () => {
    router.push("/checkout")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between m-auto">
        <Link href="/" className="font-bold text-xl ml-4">
          {t("storeName")}
        </Link>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <ModeToggle />
          
          <Button 
            variant="outline" 
            size="icon" 
            className="relative"
            onClick={handleCartClick}
            aria-label={t("cart")}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
