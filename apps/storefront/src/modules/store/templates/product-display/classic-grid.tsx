
import { Text } from "@modules/common/components/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import PreviewPrice from "@modules/products/components/product-preview/price"

type ClassicGridProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}

export default function ClassicGrid({
  product,
  region,
}: ClassicGridProps) {
  const { cheapestPrice } = getProductPrice({ product })

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block"
    >
      <div
        className="rounded-lg overflow-hidden"
        data-testid="product-wrapper"
      >
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
        />

        <div className="mt-4 flex items-start justify-between gap-3">
          <Text
            className="text-ui-fg-subtle"
            data-testid="product-title"
          >
            {product.title}
          </Text>

          {cheapestPrice && (
            <PreviewPrice price={cheapestPrice} />
          )}
        </div>
      </div>
    </LocalizedClientLink>
  )
}
