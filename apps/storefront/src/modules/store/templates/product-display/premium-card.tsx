
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import PreviewPrice from "@modules/products/components/product-preview/price"

type PremiumCardProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}

export default function PremiumCard({
  product,
  region,
}: PremiumCardProps) {
  const { cheapestPrice } = getProductPrice({ product })

  return (
    <article
      data-testid="product-wrapper"
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl"
    >
      {/* Premium header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-800 via-purple-700 to-fuchsia-700 px-4 py-3.5 text-white">
        <div className="absolute -right-5 -top-8 h-24 w-24 rounded-full bg-white/10" />
        <div className="absolute -right-1 bottom-0 h-12 w-12 rounded-full bg-white/5" />

        <div className="relative flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-purple-200">
              Curated collection
            </p>
            <h3 className="mt-1 text-sm font-bold sm:text-base">
              Premium Selection
            </h3>
          </div>

          <span className="shrink-0 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wide">
            Featured
          </span>
        </div>
      </div>

      {/* Product image */}
      <LocalizedClientLink
        href={`/products/${product.handle}`}
        className="block"
        aria-label={`View ${product.title}`}
      >
        <div className="relative overflow-hidden bg-[#f7f5f2] p-3 sm:p-4">
          <div className="absolute left-5 top-5 z-10 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-gray-800 shadow-sm">
            Premium pick
          </div>

          <div className="aspect-square overflow-hidden rounded-xl bg-white">
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              size="square"
              className="!h-full !w-full !rounded-xl !bg-white !p-0 !shadow-none transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>

          <div className="absolute bottom-5 right-5 rounded-full border border-gray-100 bg-white/95 px-3 py-1.5 text-[10px] font-semibold text-violet-800 shadow-sm">
            Explore product
          </div>
        </div>
      </LocalizedClientLink>

      {/* Product details */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="rounded-md bg-violet-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-violet-700">
            Premium
          </span>

          <span className="text-[11px] text-gray-400">
            Product
          </span>
        </div>

        <LocalizedClientLink
          href={`/products/${product.handle}`}
          className="block"
        >
          <h3
            data-testid="product-title"
            className="line-clamp-2 min-h-12 text-base font-bold leading-6 text-gray-900 transition-colors group-hover:text-violet-700 sm:text-lg"
          >
            {product.title}
          </h3>
        </LocalizedClientLink>

        {product.subtitle && (
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-gray-500">
            {product.subtitle}
          </p>
        )}

        {product.description && (
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500">
            {product.description}
          </p>
        )}

        {/* Price from Medusa */}
        <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">
            Price
          </p>

          <div className="mt-1 break-words text-lg font-bold text-gray-950">
            {cheapestPrice ? (
              <PreviewPrice price={cheapestPrice} />
            ) : (
              <span className="text-sm font-medium text-gray-500">
                Price unavailable
              </span>
            )}
          </div>
        </div>

        {/* Product CTA */}
        <div className="mt-auto pt-4">
          <LocalizedClientLink
            href={`/products/${product.handle}`}
            className="flex w-full items-center justify-between gap-3 rounded-xl bg-gray-950 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-violet-700"
          >
            <span>View product</span>

            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 transition-transform group-hover:translate-x-1">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </LocalizedClientLink>

          <p className="mt-3 text-center text-[10px] text-gray-400">
            View details and available options
          </p>
        </div>
      </div>
    </article>
  )
}
