import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { CartProvider } from "@/components/cart-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider"
import { Toaster } from "@/components/ui/toaster"
import { Sidebar } from "@/components/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Cửa hàng Thông phụ tùng xe máy",
  description: "Hệ thống quản lý cửa hàng Thông phụ tùng xe máy",
  generator: "v0.dev"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <LanguageProvider>
            <CartProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex flex-1">
                  <Sidebar />
                  <main className="flex-1 lg:ml-64">
                    <div className="p-4 md:p-6">
                      {children}
                    </div>
                  </main>
                </div>
                <footer className="py-6 border-t lg:ml-64">
                  <div className="container mx-auto px-4 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} Motorbike Warehouse. All rights reserved.
                  </div>
                </footer>
              </div>
              <Toaster />
            </CartProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
