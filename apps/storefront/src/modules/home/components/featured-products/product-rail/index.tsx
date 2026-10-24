
import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@modules/common/components/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts?.length) {
    return null
  }

  return (
    <section className="content-container py-8 small:py-12">
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <Text className="txt-xlarge font-bold text-gray-900">
          {collection.title}
        </Text>

        <InteractiveLink href={`/collections/${collection.handle}`}>
          View all
        </InteractiveLink>
      </div>

      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 small:grid-cols-3 small:gap-x-6 small:gap-y-10 medium:grid-cols-4">
        {pricedProducts.map((product) => (
          <li key={product.id} className="min-w-0">
            <ProductPreview
              product={product}
              region={region}
              isFeatured
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
