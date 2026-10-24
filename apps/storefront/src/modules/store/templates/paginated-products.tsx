
import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getProductDisplayTemplate } from "@lib/data/product-display-templates"
import { OptionValueIds } from "@lib/util/product-option-filters"
import ProductTemplateRenderer from "./product-display/renderer"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  optionValueIds,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  optionValueIds?: OptionValueIds
}) {
  const queryParams: PaginatedProductsParams = {
    limit: PRODUCT_LIMIT,
  }

  if (collectionId) {
    queryParams.collection_id = [collectionId]
  }

  if (categoryId) {
    queryParams.category_id = [categoryId]
  }

  if (productsIds) {
    queryParams.id = productsIds
  }

  if (sortBy === "created_at") {
    queryParams.order = "created_at"
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
    optionValueIds,
  })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)
  const selectedTemplate = await getProductDisplayTemplate()
  const listView = selectedTemplate === "list-view"

  return (
    <section className="w-full min-w-0">
      {/* Product results heading */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          {count} {count === 1 ? "product" : "products"} found
        </p>

        <p className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium capitalize text-gray-600">
          {selectedTemplate.replace(/-/g, " ")}
        </p>
      </div>

      {/* Empty state */}
      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-50 text-violet-700">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-7 w-7"
              aria-hidden="true"
            >
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m16 16 4 4M8 10h5" />
            </svg>
          </div>

          <h2 className="text-lg font-semibold text-gray-900">
            No products found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Try changing your filters or selecting another collection.
          </p>
        </div>
      ) : (
        <ul
          data-testid="products-list"
          className={
            listView
              ? "flex w-full min-w-0 flex-col gap-5"
              : "grid w-full min-w-0 grid-cols-1 items-stretch gap-x-5 gap-y-7 sm:grid-cols-2 xl:grid-cols-3"
          }
        >
          {products.map((product) => (
            <li
              key={product.id}
              className="min-w-0"
            >
              <div className="h-full min-w-0 overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-0.5">
                <ProductTemplateRenderer
                  product={product}
                  region={region}
                  template={selectedTemplate}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          aria-label="Product pagination"
          className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-4 py-5 sm:flex-row sm:px-6"
        >
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>

          <Pagination
            data-testid="product-pagination"
            page={page}
            totalPages={totalPages}
          />
        </nav>
      )}
    </section>
  )
}
