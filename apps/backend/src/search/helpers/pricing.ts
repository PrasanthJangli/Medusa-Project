
import type { SearchTypes } from "@medusajs/framework/types"
import { QueryContext, search } from "@medusajs/framework/utils"

/**
 * The currencies the index holds prices in.
 * Keep in sync with storefront SEARCH_PRICE_CURRENCIES.
 */
export const PRICE_CURRENCIES = ["inr", "eur", "usd"] as const

export type PriceCurrency = (typeof PRICE_CURRENCIES)[number]

// Read once per currency because Pricing Module calculates
// for a single currency per query.
const PRICE_GRAPH_FIELDS = [
  "id",
  "variants.calculated_price.calculated_amount",
  "variants.calculated_price.original_amount",
]

const pricingContext = (currency: PriceCurrency) => ({
  variants: {
    calculated_price: QueryContext({ currency_code: currency }),
  },
})

type PricedVariant = {
  calculated_price?: {
    calculated_amount?: number | null
    original_amount?: number | null
  } | null
  [key: string]: unknown
} | null

/** A product's priced variants per currency. */
export type ProductPricingRows = Partial<
  Record<PriceCurrency, PricedVariant[] | null>
>

type PriceFieldName =
  `${"min_price" | "max_price" | "original_price"}_${PriceCurrency}`

export type ProductPricing = {
  [K in PriceFieldName]?: number | null
}

type PriceFields = {
  [K in PriceFieldName]: ReturnType<typeof search.float>
}

/** Per-currency price fields for the search index. */
export const priceFields = Object.fromEntries(
  PRICE_CURRENCIES.flatMap((currency) => [
    [
      `min_price_${currency}`,
      search.float().filterable().sortable().retrievable(),
    ],
    [
      `max_price_${currency}`,
      search.float().filterable().sortable().retrievable(),
    ],
    [
      `original_price_${currency}`,
      search.float().retrievable(),
    ],
  ]),
) as PriceFields

/**
 * Calculate the cheapest and maximum variant prices
 * for one currency.
 */
function toPricing(
  currency: PriceCurrency,
  variants: PricedVariant[] | null | undefined,
): ProductPricing {
  let cheapest: { calculated: number; original: number } | undefined
  let maxPrice: number | undefined

  for (const variant of variants ?? []) {
    const price = variant?.calculated_price
    const calculated = price?.calculated_amount

    if (typeof calculated !== "number") {
      continue
    }

    const original =
      typeof price?.original_amount === "number"
        ? price.original_amount
        : calculated

    if (maxPrice === undefined || calculated > maxPrice) {
      maxPrice = calculated
    }

    if (!cheapest || calculated < cheapest.calculated) {
      cheapest = { calculated, original }
    }
  }

  if (!cheapest) {
    return {}
  }

  return {
    [`min_price_${currency}`]: cheapest.calculated,
    [`max_price_${currency}`]: maxPrice ?? cheapest.calculated,
    [`original_price_${currency}`]: cheapest.original,
  } as ProductPricing
}

/** Every currency's price fields for one product. */
export function toProductPricing(
  pricingRows: ProductPricingRows | undefined,
): ProductPricing {
  return Object.assign(
    {},
    ...PRICE_CURRENCIES.map((currency) =>
      toPricing(currency, pricingRows?.[currency]),
    ),
  )
}

/**
 * Fetch the priced variants of products once per currency.
 */
export async function loadPricing(
  ids: string[],
  { container }: SearchTypes.SearchIngestionContext,
): Promise<Map<string, ProductPricingRows>> {
  const pricing = new Map<string, ProductPricingRows>()

  if (!ids.length) {
    return pricing
  }

  await Promise.all(
    PRICE_CURRENCIES.map(async (currency) => {
      const { data } = await container.query.graph({
        entity: "product",
        fields: PRICE_GRAPH_FIELDS,
        filters: { id: ids },
        context: pricingContext(currency),
      })

      // DEBUG: Check calculated prices returned for each currency.
      console.log(
        `PRICING DEBUG - ${currency.toUpperCase()}:`,
        JSON.stringify(
          data.map((product) => ({
            id: product.id,
            variants: product.variants,
          })),
          null,
          2
        )
      )

      for (const product of data) {
        const rows = pricing.get(product.id) ?? {}
        rows[currency] = product.variants as PricedVariant[] | null
        pricing.set(product.id, rows)
      }
    }),
  )

  return pricing
}
