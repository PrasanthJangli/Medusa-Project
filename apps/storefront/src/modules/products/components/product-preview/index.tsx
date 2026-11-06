
import { Text } from "@modules/common/components/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { translateProductName } from "@lib/util/translate-product"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default function ProductPreview({
  product,
  isFeatured,
  region,
  locale = "en",
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
  locale?: string
}) {
  const productName = translateProductName(product.title, locale)
  const { cheapestPrice } = getProductPrice({ product })

  const viewProductText =
    locale === "te"
      ? "ఉత్పత్తిని చూడండి"
      : locale === "hi"
        ? "उत्पाद देखें"
        : "View Product"

  return (
    <div className="product-card">
      <LocalizedClientLink
        href={`/products/${product.handle}`}
        className="group block h-full"
      >
        <div
          data-testid="product-wrapper"
          className="theme-card h-full overflow-hidden"
        >
          <div className="overflow-hidden theme-surface">
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              size="full"
              isFeatured={isFeatured}
            />
          </div>

          <div className="flex flex-col gap-2 p-3 small:p-4">
            <Text
              className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 theme-text transition-colors group-hover:theme-primary-text"
              data-testid="product-title"
            >
              {productName}
            </Text>

            <div className="flex items-center">
              {cheapestPrice ? (
                <div className="text-base font-semibold theme-primary-text">
                  <PreviewPrice price={cheapestPrice} />
                </div>
              ) : (
                <span className="text-sm theme-muted">
                  Price unavailable
                </span>
              )}
            </div>

            <div className="mt-2">
              <span className="inline-flex items-center text-xs font-semibold theme-primary-text transition-all duration-300 group-hover:translate-x-1">
                {viewProductText} →
              </span>
            </div>
          </div>
        </div>
      </LocalizedClientLink>
    </div>
  )
}
