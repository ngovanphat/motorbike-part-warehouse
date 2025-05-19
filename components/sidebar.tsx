"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Receipt, 
  ShoppingCart, 
  Menu, 
  X 
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const { t } = useLanguage()
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  const navigationItems = [
    {
      name: t("dashboard") || "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard"
    },
    {
      name: t("products") || "Products",
      href: "/",
      icon: ShoppingBag,
      active: pathname === "/"
    },
    {
      name: t("invoices") || "Invoices",
      href: "/invoices",
      icon: Receipt,
      active: pathname === "/invoices"
    },
    {
      name: t("checkout") || "Checkout",
      href: "/checkout",
      icon: ShoppingCart,
      active: pathname === "/checkout"
    }
  ]

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden flex items-center p-4">
        <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="mr-2">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {/* Sidebar - Desktop and Mobile */}
      <aside
        className={cn(
          "bg-card border-r fixed z-30 inset-y-0 left-0 transform transition duration-300 ease-in-out lg:translate-x-0 w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo and Close Button (Mobile) */}
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link href="/" className="font-bold text-lg">
              Motorbike Warehouse
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center px-4 py-3 text-sm rounded-md transition-colors",
                  item.active
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Backdrop (Mobile) */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}
    </>
  )
} 