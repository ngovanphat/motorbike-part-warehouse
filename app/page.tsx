"use client"

import { useLanguage } from "@/components/language-provider"
import { ProductTable } from "@/components/product-table"

export default function Home() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("productCatalog")}</h1>
      <ProductTable />
    </div>
  )
}
