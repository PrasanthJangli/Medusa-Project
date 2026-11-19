import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getUiLocale } from "@lib/data/ui-locale-actions"
import { HttpTypes } from "@medusajs/types"
import Product from "../product-preview"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

const translations = {
  en: {
    title: "Related products",
    description: "You might also want to check out these products.",
  },
  te: {
    title: "సంబంధిత ఉత్పత్తులు",
    description: "మీరు ఈ ఉత్పత్తులను కూడా చూడవచ్చు.",
  },
  hi: {
    title: "संबंधित उत्पाद",
    description: "आप इन उत्पादों को भी देख सकते हैं।",
  },
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const locale = await getUiLocale()
  const t = translations[locale as keyof typeof translations] || translations.en

  // Define related products logic.
  const queryParams: HttpTypes.StoreProductListParams = {}

  if (region?.id) {
    queryParams.region_id = region.id
  }

  if (product.collection_id) {
    queryParams.collection_id = [product.collection_id]
  }

  if (product.tags) {
    queryParams.tag_id = product.tags
      .map((t) => t.id)
      .filter(Boolean) as string[]
  }

  queryParams.is_giftcard = false

  const products = await listProducts({
    queryParams,
    countryCode,
  }).then(({ response }) => {
    return response.products.filter(
      (responseProduct) => responseProduct.id !== product.id
    )
  })

  if (!products.length) {
    return null
  }

  return (
    <div className="product-page-constraint">
      <div className="mb-16 flex flex-col items-center text-center">
        <span className="text-base-regular mb-6 text-gray-600">
          {t.title}
        </span>

        <p className="text-2xl-regular max-w-lg text-ui-fg-base">
          {t.description}
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-x-6 gap-y-8 small:grid-cols-3 medium:grid-cols-4">
        {products.map((relatedProduct) => (
          <li key={relatedProduct.id}>
            <Product region={region} product={relatedProduct} />
          </li>
        ))}
      </ul>
    </div>
  )
}