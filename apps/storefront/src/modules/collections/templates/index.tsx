import { Suspense } from "react"

import { getUiLocale } from "@lib/data/ui-locale-actions"
import { OptionValueIds } from "@lib/util/product-option-filters"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"

const translations = {
  en: {
    home: "Home",
    explore: "Explore the collection",
    productLoaded: "Product loaded",
    productsLoaded: "Products loaded",
    filters: "Filters",
    refineProducts: "Refine products",
    allProducts: "All products",
    browseProducts: "Browse products in",
    collection: "Collection",
  },
  te: {
    home: "హోమ్",
    explore: "కలెక్షన్‌ను అన్వేషించండి",
    productLoaded: "ఉత్పత్తి లోడ్ అయింది",
    productsLoaded: "ఉత్పత్తులు లోడ్ అయ్యాయి",
    filters: "ఫిల్టర్లు",
    refineProducts: "ఉత్పత్తులను ఫిల్టర్ చేయండి",
    allProducts: "అన్ని ఉత్పత్తులు",
    browseProducts: "ఈ కలెక్షన్‌లోని ఉత్పత్తులను చూడండి:",
    collection: "కలెక్షన్",
  },
  hi: {
    home: "होम",
    explore: "कलेक्शन देखें",
    productLoaded: "उत्पाद लोड हुआ",
    productsLoaded: "उत्पाद लोड हुए",
    filters: "फ़िल्टर",
    refineProducts: "उत्पाद फ़िल्टर करें",
    allProducts: "सभी उत्पाद",
    browseProducts: "इस कलेक्शन के उत्पाद देखें:",
    collection: "कलेक्शन",
  },
}

export default async function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
  optionValueIds,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
}) {
  const locale = await getUiLocale()
  const t =
    translations[locale as keyof typeof translations] || translations.en

  const pageNumber = page ? parseInt(page, 10) : 1
  const sort = sortBy || "created_at"

  const products = collection.products ?? []
  const productCount = products.length

  return (
    <main className="min-h-screen bg-[#faf9f7]">
      <div className="content-container py-8 md:py-12">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-sm text-gray-500"
        >
          <a href="/" className="transition-colors hover:text-violet-700">
            {t.home}
          </a>
          <span>/</span>
          <span className="font-medium text-gray-900">
            {collection.title}
          </span>
        </nav>

        {/* Collection heading */}
        <section className="mb-8 border-b border-gray-200 pb-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-violet-700">
                {t.explore}
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl lg:text-5xl">
                {collection.title}
              </h1>
            </div>

            <div className="flex shrink-0 items-center gap-3 self-start rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm md:self-auto">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>

              <div>
                <p className="text-2xl font-bold text-gray-950">
                  {productCount}
                </p>
                <p className="text-xs text-gray-500">
                  {productCount === 1
                    ? t.productLoaded
                    : t.productsLoaded}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Products and filters */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-5">
            <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                {t.filters}
              </h2>
              <span className="text-xs text-gray-400">
                {t.refineProducts}
              </span>
            </div>

            <RefinementList sortBy={sort} hideOptionsPicker />
          </aside>

          <section className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-950">
                  {t.allProducts}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {t.browseProducts} {collection.title}
                </p>
              </div>

              <div className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-600">
                {t.collection}
              </div>
            </div>

            <Suspense
              fallback={
                <SkeletonProductGrid
                  numberOfProducts={products.length || 6}
                />
              }
            >
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                collectionId={collection.id}
                countryCode={countryCode}
                optionValueIds={optionValueIds}
              />
            </Suspense>
          </section>
        </div>
      </div>
    </main>
  )
}