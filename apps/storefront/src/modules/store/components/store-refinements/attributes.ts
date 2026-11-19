
import { PRODUCT_INDEX_NAME, priceAttribute } from "@lib/search-client"

export const OPTION_VALUES_ATTRIBUTE = "option_values"
export const CATEGORY_ATTRIBUTE = "category"
export const COLLECTION_ATTRIBUTE = "collection_title"
export const LABELS_ATTRIBUTE = "labels"

export const getSortOptions = (
  currencyCode: string,
  translations?: {
    relevance?: string
    latestArrivals?: string
    priceLowToHigh?: string
    priceHighToLow?: string
    titleAToZ?: string
    titleZToA?: string
  }
) => {
  const minPrice = priceAttribute("min_price", currencyCode)

  return [
    {
      value: `${PRODUCT_INDEX_NAME}/sort/title:asc`,
      label: "Product Name",
    },
    {
      value: `${PRODUCT_INDEX_NAME}/sort/created_at:desc`,
      label: "Newest",
    },
    {
      value: `${PRODUCT_INDEX_NAME}/sort/${minPrice}:desc`,
      label: translations?.priceHighToLow ?? "Price: High to Low",
    },
    {
      value: `${PRODUCT_INDEX_NAME}/sort/${minPrice}:asc`,
      label: translations?.priceLowToHigh ?? "Price: Low to High",
    },
  ]
}
