
import {
  createInstantSearchAdapter,
  type MedusaSdkLike,
} from "@medusajs/instantsearch-adapter"

import { sdk } from "@lib/config"

export const PRODUCT_INDEX_NAME = "product"

/**
 * Keep these currencies in sync with PRICE_CURRENCIES
 * in the backend's src/search/helpers/pricing.ts.
 */
export const SEARCH_PRICE_CURRENCIES = ["inr", "eur", "usd"] as const

export type PriceField =
  | "min_price"
  | "max_price"
  | "original_price"

/**
 * Get the indexed currency for the selected region.
 * If the region currency is not indexed, use INR.
 */
export const indexedCurrency = (currencyCode: string): string => {
  const code = currencyCode.toLowerCase()

  return SEARCH_PRICE_CURRENCIES.includes(
    code as (typeof SEARCH_PRICE_CURRENCIES)[number]
  )
    ? code
    : "inr"
}

/**
 * Build the price field name for the selected currency.
 */
export const priceAttribute = (
  field: PriceField,
  currencyCode: string
): string => {
  return `${field}_${indexedCurrency(currencyCode)}`
}

/**
 * Shared search client for navbar search and product listing.
 *
 * Do not configure unsupported numeric or value facets here.
 */
export const { searchClient } = createInstantSearchAdapter({
  sdk: sdk as unknown as MedusaSdkLike,
  path: "/store/search",
  additionalSearchParameters: {
    search_options: {
      match_strategy: "last",
    },
  },
})
