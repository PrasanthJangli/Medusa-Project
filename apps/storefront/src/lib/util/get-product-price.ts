
import { HttpTypes } from "@medusajs/types"
import { getPercentageDiff } from "./get-percentage-diff"
import { convertToLocale } from "./money"

type VariantWithPrice = HttpTypes.StoreProductVariant & {
  calculated_price?: {
    calculated_amount: number
    original_amount: number
    currency_code: string
    calculated_price: {
      price_list_type: string
    }
  } | null
}

export const getPricesForVariant = (variant: VariantWithPrice) => {
  const calculatedPrice = variant?.calculated_price

  if (calculatedPrice?.calculated_amount == null) {
    return null
  }

  return {
    calculated_price_number: calculatedPrice.calculated_amount,
    calculated_price: convertToLocale({
      amount: calculatedPrice.calculated_amount,
      currency_code: calculatedPrice.currency_code,
    }),
    original_price_number: calculatedPrice.original_amount,
    original_price: convertToLocale({
      amount: calculatedPrice.original_amount,
      currency_code: calculatedPrice.currency_code,
    }),
    currency_code: calculatedPrice.currency_code,
    price_type: calculatedPrice.calculated_price?.price_list_type,
    percentage_diff: getPercentageDiff(
      calculatedPrice.original_amount,
      calculatedPrice.calculated_amount
    ),
  }
}

export function getProductPrice({
  product,
  variantId,
}: {
  product: HttpTypes.StoreProduct
  variantId?: string
}) {
  if (!product?.id) {
    throw new Error("No product provided")
  }

  const cheapestPrice = () => {
    const variants = (product.variants ?? []) as VariantWithPrice[]

    const pricedVariants = variants
      .filter(
        (variant) =>
          variant.calculated_price?.calculated_amount != null
      )
      .sort(
        (a, b) =>
          (a.calculated_price?.calculated_amount ?? 0) -
          (b.calculated_price?.calculated_amount ?? 0)
      )

    if (!pricedVariants.length) {
      return null
    }

    return getPricesForVariant(pricedVariants[0])
  }

  const variantPrice = () => {
    if (!variantId) {
      return null
    }

    const variant = (product.variants ?? []).find(
      (item) => item.id === variantId || item.sku === variantId
    ) as VariantWithPrice | undefined

    if (!variant) {
      return null
    }

    return getPricesForVariant(variant)
  }

  return {
    product,
    cheapestPrice: cheapestPrice(),
    variantPrice: variantPrice(),
  }
}
