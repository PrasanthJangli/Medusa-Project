
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { HttpTypes } from "@medusajs/types"
import { OptionValueIds } from "@lib/util/product-option-filters"
import InteractiveLink from "@modules/common/components/interactive-link"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
  optionValueIds,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
}) {
  const pageNumber = page ? parseInt(page, 10) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents: HttpTypes.StoreProductCategory[] = []

  const getParents = (currentCategory: HttpTypes.StoreProductCategory) => {
    if (currentCategory.parent_category) {
      parents.push(currentCategory.parent_category)
      getParents(currentCategory.parent_category)
    }
  }

  getParents(category)

  return (
    <div
      className="content-container w-full min-w-0 py-6"
      data-testid="category-container"
    >
      <div className="flex w-full min-w-0 flex-col gap-6 small:flex-row small:items-start small:gap-8">
        {/* Sidebar */}
        <aside className="w-full min-w-0 small:w-[240px] small:shrink-0">
          <RefinementList
            sortBy={sort}
            data-testid="sort-by-container"
            hideOptionsPicker
          />
        </aside>

        {/* Main category and products area */}
        <main className="w-full min-w-0 flex-1">
          {/* Category heading */}
          <div className="mb-6 flex min-w-0 flex-wrap items-center gap-3 text-2xl-semi">
            {parents.map((parent) => (
              <span
                key={parent.id}
                className="text-ui-fg-subtle"
              >
                <LocalizedClientLink
                  className="mr-2 hover:text-black"
                  href={`/categories/${parent.handle}`}
                  data-testid="sort-by-link"
                >
                  {parent.name}
                </LocalizedClientLink>
                /
              </span>
            ))}

            <h1 data-testid="category-page-title">
              {category.name}
            </h1>
          </div>

          {/* Category description */}
          {category.description && (
            <div className="mb-6 text-base-regular">
              <p>{category.description}</p>
            </div>
          )}

          {/* Child categories */}
          {category.category_children?.length ? (
            <div className="mb-6 text-base-large">
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {category.category_children.map((child) => (
                  <li key={child.id}>
                    <InteractiveLink
                      href={`/categories/${child.handle}`}
                    >
                      {child.name}
                    </InteractiveLink>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Products */}
          <div className="w-full min-w-0">
            <Suspense
              fallback={
                <SkeletonProductGrid
                  numberOfProducts={category.products?.length ?? 8}
                />
              }
            >
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                categoryId={category.id}
                countryCode={countryCode}
                optionValueIds={optionValueIds}
              />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}
