
import { PRODUCT_INDEX_NAME, priceAttribute } from "@lib/search-client"

export const OPTION_VALUES_ATTRIBUTE = "option_values"
export const CATEGORY_ATTRIBUTE = "category"
// The index calls the product's tags "labels".
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
      value: PRODUCT_INDEX_NAME,
      label: translations?.relevance ?? "Relevance",
    },
    {
      value: `${PRODUCT_INDEX_NAME}/sort/created_at:desc`,
      label: translations?.latestArrivals ?? "Latest Arrivals",
    },
    {
      value: `${PRODUCT_INDEX_NAME}/sort/${minPrice}:asc`,
      label: translations?.priceLowToHigh ?? "Price: Low -> High",
    },
    {
      value: `${PRODUCT_INDEX_NAME}/sort/${minPrice}:desc`,
      label: translations?.priceHighToLow ?? "Price: High -> Low",
    },
    {
      value: `${PRODUCT_INDEX_NAME}/sort/title:asc`,
      label: translations?.titleAToZ ?? "Title: A -> Z",
    },
    {
      value: `${PRODUCT_INDEX_NAME}/sort/title:desc`,
      label: translations?.titleZToA ?? "Title: Z -> A",
    },
  ]
}
