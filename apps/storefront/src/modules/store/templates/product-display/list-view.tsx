
import { Text } from "@modules/common/components/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import PreviewPrice from "@modules/products/components/product-preview/price"

type ListViewProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}

export default function ListView({
  product,
  region,
}: ListViewProps) {
  const { cheapestPrice } = getProductPrice({ product })

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block w-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
    >
      <article
        data-testid="product-wrapper"
        className="relative flex w-full flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl sm:flex-row sm:items-stretch"
      >
        {/* Subtle top accent */}
        <div className="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Product image */}
        <div className="relative w-full shrink-0 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:w-44 sm:p-5 md:w-52">
          <div className="relative mx-auto aspect-square w-full max-w-52 overflow-hidden rounded-xl bg-white ring-1 ring-gray-200/70">
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              size="full"
            />
          </div>

          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Product
          </span>
        </div>

        {/* Product information */}
        <div className="flex min-w-0 flex-1 flex-col justify-center p-4 sm:p-5 md:p-6">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-purple-700">
              Discover
            </span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span className="text-xs text-gray-500">
              Product details
            </span>
          </div>

          <Text
            className="line-clamp-2 text-lg font-bold leading-7 tracking-tight text-gray-900 transition-colors duration-200 group-hover:text-purple-700 sm:text-xl"
            data-testid="product-title"
          >
            {product.title}
          </Text>

          {product.description && (
            <p className="mt-2 line-clamp-3 max-w-2xl text-sm leading-6 text-gray-500">
              {product.description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600 ring-1 ring-gray-200/80">
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="h-4 w-4 text-purple-600"
              >
                <path
                  d="M10 2.5 12.3 7.2 17.5 8 13.75 11.65 14.65 16.8 10 14.35 5.35 16.8 6.25 11.65 2.5 8 7.7 7.2 10 2.5Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
              Explore collection
            </span>
          </div>

          <div className="mt-5 hidden h-px w-full bg-gradient-to-r from-gray-200 via-gray-100 to-transparent sm:block" />

          <span className="mt-4 inline-flex w-fit items-center gap-2 text-sm font-semibold text-purple-700">
            Explore Product
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1.5"
            >
              →
            </span>
          </span>
        </div>

        {/* Price panel */}
        <div className="flex w-full shrink-0 flex-row items-center justify-between gap-4 border-t border-gray-100 bg-gray-50/80 p-4 sm:w-48 sm:flex-col sm:items-start sm:justify-center sm:border-l sm:border-t-0 sm:p-5 md:w-52">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">
              Your Price
            </p>

            <div
              className="mt-2 text-lg font-bold tracking-tight text-gray-900"
              data-testid="product-price"
            >
              {cheapestPrice ? (
                <PreviewPrice price={cheapestPrice} />
              ) : (
                <span className="text-sm font-medium text-gray-500">
                  Price unavailable
                </span>
              )}
            </div>

            <p className="mt-2 max-w-40 text-xs leading-5 text-gray-500">
              Final price may vary based on selected options.
            </p>
          </div>

          <span className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3 text-xs font-bold text-white shadow-md shadow-purple-200/60 transition-all duration-200 group-hover:from-violet-700 group-hover:to-purple-700 group-hover:shadow-lg sm:mt-5 sm:w-full">
            View Details
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </div>
      </article>
    </LocalizedClientLink>
  )
}
