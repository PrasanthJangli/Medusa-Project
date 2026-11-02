
"use client"

type PriceRangeProps = {
  currencyCode: string
}

/**
 * Price range filter is temporarily disabled because
 * the current Postgres search provider does not support
 * stats facets for min_price_inr.
 *
 * Keeping currencyCode in the props ensures existing
 * PriceRange component usage does not need to change.
 */
const PriceRange = ({ currencyCode }: PriceRangeProps) => {
  // Prevent unused-prop warnings.
  void currencyCode

  return null
}

export default PriceRange
