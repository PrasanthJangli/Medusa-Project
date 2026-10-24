
"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button, Text } from "@modules/common/components/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"

import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce(
    (acc: Record<string, string>, varopt) => {
      if (varopt.option_id) {
        acc[varopt.option_id] = varopt.value
      }

      return acc
    },
    {} as Record<string, string>
  )
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const countryCode = useParams().countryCode as string

  const [options, setOptions] = useState<
    Record<string, string | undefined>
  >({})
  const [isAdding, setIsAdding] = useState(false)
  const [cartMessage, setCartMessage] = useState("")

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  // Automatically select options when only one variant exists.
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(
        product.variants[0].options
      )

      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  // Find the variant matching the selected options.
  const selectedVariant = useMemo(() => {
    if (!product.variants?.length) {
      return undefined
    }

    return product.variants.find((variant) => {
      const variantOptions = optionsAsKeymap(variant.options)

      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  const setOptionValue = (optionId: string, value: string) => {
    setOptions((previous) => ({
      ...previous,
      [optionId]: value,
    }))

    setCartMessage("")
  }

  // Check whether the selected options match a real variant.
  const isValidVariant = useMemo(() => {
    return Boolean(selectedVariant)
  }, [selectedVariant])

  // Keep the selected variant in the URL.
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const variantId = isValidVariant ? selectedVariant?.id : undefined

    if (params.get("v_id") === (variantId ?? null)) {
      return
    }

    if (variantId) {
      params.set("v_id", variantId)
    } else {
      params.delete("v_id")
    }

    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    })
  }, [selectedVariant?.id, isValidVariant, pathname, router, searchParams])

  // Check inventory and backorder settings.
  const inStock = useMemo(() => {
    if (!selectedVariant) {
      return false
    }

    if (!selectedVariant.manage_inventory) {
      return true
    }

    if (selectedVariant.allow_backorder) {
      return true
    }

    return (selectedVariant.inventory_quantity ?? 0) > 0
  }, [selectedVariant])

  // Add the selected variant to the cart.
  const handleAddToCart = async () => {
    if (!selectedVariant?.id || !isValidVariant || !inStock || isAdding) {
      return
    }

    setIsAdding(true)
    setCartMessage("")

    try {
      await addToCart({
        variantId: selectedVariant.id,
        quantity: 1,
        countryCode,
      })

      setCartMessage("Product added to cart.")
    } catch (error) {
      console.error("Could not add product to cart:", error)
      setCartMessage("Could not add this product. Please try again.")
    } finally {
      setIsAdding(false)
    }
  }

  const buttonText = !selectedVariant
    ? "Choose options"
    : !inStock
      ? "Out of stock"
      : isAdding
        ? "Adding to cart..."
        : "Add to cart"

  return (
    <>
      <div
        ref={actionsRef}
        className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
      >
        {/* Purchase panel heading */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
            Your selection
          </p>

          <h3 className="mt-1 text-lg font-bold text-[#17283d]">
            Choose your options
          </h3>

          <p className="mt-1 text-sm leading-6 text-gray-500">
            Select the available options before adding this product
            to your cart.
          </p>
        </div>

        <Divider />

        {/* Product variants */}
        {(product.variants?.length ?? 0) > 1 && (
          <div className="flex flex-col gap-5">
            {(product.options ?? []).map((option) => (
              <div
                key={option.id}
                className="rounded-xl bg-gray-50 p-3 sm:p-4"
              >
                <OptionSelect
                  option={option}
                  current={options[option.id]}
                  updateOption={setOptionValue}
                  title={option.title ?? "Options"}
                  data-testid="product-options"
                  disabled={!!disabled || isAdding}
                />
              </div>
            ))}
          </div>
        )}

        {/* Selection status */}
        {(product.variants?.length ?? 0) > 1 && !selectedVariant && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Please select all required options.
          </p>
        )}

        {selectedVariant && (
          <div
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
              inStock
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            <span
              aria-hidden="true"
              className={`h-2 w-2 rounded-full ${
                inStock ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
            {inStock ? "Available for purchase" : "Currently out of stock"}
          </div>
        )}

        {/* Price */}
        <div className="rounded-xl border border-gray-100 bg-[#f8fafc] p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Price
          </p>

          <div className="text-[#17283d]">
            <ProductPrice
              product={product}
              variant={selectedVariant}
            />
          </div>

          <p className="mt-2 text-xs text-gray-500">
            Final price depends on the selected variant.
          </p>
        </div>

        {/* Add to cart */}
        <Button
          onClick={handleAddToCart}
          disabled={
            !inStock ||
            !selectedVariant ||
            !!disabled ||
            isAdding ||
            !isValidVariant
          }
          variant="primary"
          className="h-12 w-full rounded-xl bg-[#17283d] text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#243e58] disabled:cursor-not-allowed disabled:opacity-50"
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {buttonText}
          {!isAdding && inStock && selectedVariant && (
            <span className="ml-2" aria-hidden="true">
              →
            </span>
          )}
        </Button>

        {/* Cart feedback */}
        {cartMessage && (
          <Text
            role="status"
            aria-live="polite"
            className={`text-sm ${
              cartMessage.startsWith("Product added")
                ? "text-emerald-700"
                : "text-red-600"
            }`}
          >
            {cartMessage}
          </Text>
        )}

        {/* Helpful information */}
        <div className="flex gap-3 rounded-xl border border-gray-100 p-3">
          <span className="text-xl" aria-hidden="true">
            🛍️
          </span>

          <div>
            <p className="text-sm font-semibold text-gray-800">
              Ready when you are
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Review your selected options and add the item to your
              cart when you are ready.
            </p>
          </div>
        </div>
      </div>

      {/* Preserve the existing mobile purchase actions. */}
      <MobileActions
        product={product}
        variant={selectedVariant}
        options={options}
        updateOptions={setOptionValue}
        inStock={inStock}
        handleAddToCart={handleAddToCart}
        isAdding={isAdding}
        show={!inView}
        optionsDisabled={!!disabled || isAdding}
      />
    </>
  )
}
