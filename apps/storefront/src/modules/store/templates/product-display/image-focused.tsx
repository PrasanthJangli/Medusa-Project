
import { Text } from "@modules/common/components/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import PreviewPrice from "@modules/products/components/product-preview/price"

type ImageFocusedProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}

export default function ImageFocused({
  product,
  region,
}: ImageFocusedProps) {
  const { cheapestPrice } = getProductPrice({ product })

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block h-full"
    >
      <article
        data-testid="product-wrapper"
        className="relative h-full overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-orange-50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl"
      >
        {/* Colourful top strip */}
        <div className="h-1.5 bg-gradient-to-r from-violet-700 via-fuchsia-500 to-orange-400" />

        {/* Product image */}
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-100 via-white to-orange-100 p-3 sm:p-4">
          <span className="absolute left-5 top-5 z-10 rounded-full bg-gradient-to-r from-violet-700 to-fuchsia-600 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md">
            Image Edition
          </span>

          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="transition-transform duration-500 ease-out group-hover:scale-105">
              <Thumbnail
                thumbnail={product.thumbnail}
                images={product.images}
                size="full"
              />
            </div>
          </div>

          <span className="absolute bottom-5 right-5 rounded-full border border-white bg-white/95 px-3 py-1.5 text-[10px] font-bold text-purple-700 shadow-md">
            ✨ Featured Design
          </span>
        </div>

        {/* Product details */}
        <div className="flex flex-col gap-3 p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-violet-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-violet-700">
              Exclusive Collection
            </span>

            <span className="rounded-md bg-orange-100 px-2.5 py-1 text-[10px] font-bold text-orange-700">
              Discover More
            </span>
          </div>

          <Text
            className="line-clamp-2 text-base font-bold leading-6 text-gray-900 transition-colors duration-300 group-hover:text-violet-700 sm:text-lg"
            data-testid="product-title"
          >
            {product.title}
          </Text>

          <p className="text-sm leading-6 text-gray-500">
            Explore product details and discover something special.
          </p>

          {/* Price section */}
          <div className="rounded-xl border border-orange-100 bg-gradient-to-r from-orange-50 via-white to-violet-50 p-3">
            <p className="mb-2 text-[10px] font-extrabold uppercase tracking-widest text-orange-700">
              Product Price
            </p>

            <div className="text-gray-950">
              {cheapestPrice && (
                <PreviewPrice price={cheapestPrice} />
              )}
            </div>
          </div>

          {/* View product action */}
          <div className="flex items-center justify-between gap-3 rounded-xl bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-600 px-4 py-3 text-sm font-bold text-white transition-all duration-300 group-hover:from-orange-500 group-hover:via-amber-400 group-hover:to-yellow-300 group-hover:text-gray-950">
            <span>View Product</span>

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </div>
        </div>
      </article>
    </LocalizedClientLink>
  )
}
