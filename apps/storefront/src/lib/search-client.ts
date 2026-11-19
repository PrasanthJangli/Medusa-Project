
import {
  createInstantSearchAdapter,
  type MedusaSdkLike,
} from "@medusajs/instantsearch-adapter"

import { sdk } from "@lib/config"

export const PRODUCT_INDEX_NAME = "product"

export const SEARCH_PRICE_CURRENCIES = [
  "inr",
  "eur",
  "usd",
] as const

export type PriceField =
  | "min_price"
  | "max_price"
  | "original_price"

export const indexedCurrency = (currencyCode: string): string => {
  const code = currencyCode.toLowerCase()

  return SEARCH_PRICE_CURRENCIES.includes(
    code as (typeof SEARCH_PRICE_CURRENCIES)[number]
  )
    ? code
    : "inr"
}

export const priceAttribute = (
  field: PriceField,
  currencyCode: string
): string => {
  return `${field}_${indexedCurrency(currencyCode)}`
}

export const { searchClient } = createInstantSearchAdapter({
  sdk: sdk as unknown as MedusaSdkLike,
  path: "/store/search",

  // Numeric fields used by InstantSearch range widgets.
  numericAttributes: SEARCH_PRICE_CURRENCIES.map(
    (currency) => `min_price_${currency}`
  ),

  additionalSearchParameters: {
    search_options: {
      match_strategy: "last",
    },
  },
})
