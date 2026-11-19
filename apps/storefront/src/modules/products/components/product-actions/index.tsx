"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button, Text } from "@modules/common/components/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useLocale } from "next-intl"
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

const translations = {
  en: {
    yourSelection: "Your selection",
    chooseOptions: "Choose your options",
    selectOptionsDescription: "Select the available options before adding this product to your cart.",
    options: "Options",
    selectRequired: "Please select all required options.",
    available: "Available for purchase",
    outOfStock: "Currently out of stock",
    price: "Price",
    finalPrice: "Final price depends on the selected variant.",
    chooseOptionsButton: "Choose options",
    adding: "Adding to cart...",
    addToCart: "Add to cart",
    productAdded: "Product added to cart.",
    addError: "Could not add this product. Please try again.",
    ready: "Ready when you are",
    readyDescription: "Review your selected options and add the item to your cart when you are ready.",
  },
  te: {
    yourSelection: "మీ ఎంపిక",
    chooseOptions: "మీకు కావలసిన ఎంపికలను ఎంచుకోండి",
    selectOptionsDescription: "ఈ ఉత్పత్తిని కార్ట్‌లో చేర్చే ముందు అందుబాటులో ఉన్న ఎంపికలను ఎంచుకోండి.",
    options: "ఎంపికలు",
    selectRequired: "దయచేసి అవసరమైన అన్ని ఎంపికలను ఎంచుకోండి.",
    available: "కొనుగోలుకు అందుబాటులో ఉంది",
    outOfStock: "ప్రస్తుతం స్టాక్‌లో లేదు",
    price: "ధర",
    finalPrice: "చివరి ధర మీరు ఎంచుకున్న వేరియంట్‌పై ఆధారపడి ఉంటుంది.",
    chooseOptionsButton: "ఎంపికలను ఎంచుకోండి",
    adding: "కార్ట్‌లో చేరుస్తున్నాము...",
    addToCart: "కార్ట్‌లో చేర్చండి",
    productAdded: "ఉత్పత్తి కార్ట్‌లో చేర్చబడింది.",
    addError: "ఈ ఉత్పత్తిని కార్ట్‌లో చేర్చలేకపోయాము. దయచేసి మళ్లీ ప్రయత్నించండి.",
    ready: "మీరు సిద్ధంగా ఉన్నప్పుడు",
    readyDescription: "మీరు ఎంచుకున్న ఎంపికలను పరిశీలించి, సిద్ధంగా ఉన్నప్పుడు ఉత్పత్తిని కార్ట్‌లో చేర్చండి.",
  },
  hi: {
    yourSelection: "आपका चयन",
    chooseOptions: "अपने विकल्प चुनें",
    selectOptionsDescription: "इस उत्पाद को कार्ट में जोड़ने से पहले उपलब्ध विकल्प चुनें।",
    options: "विकल्प",
    selectRequired: "कृपया सभी आवश्यक विकल्प चुनें।",
    available: "खरीदारी के लिए उपलब्ध",
    outOfStock: "फिलहाल स्टॉक में उपलब्ध नहीं है",
    price: "कीमत",
    finalPrice: "अंतिम कीमत आपके चुने गए विकल्प पर निर्भर करती है।",
    chooseOptionsButton: "विकल्प चुनें",
    adding: "कार्ट में जोड़ा जा रहा है...",
    addToCart: "कार्ट में जोड़ें",
    productAdded: "उत्पाद कार्ट में जोड़ दिया गया है।",
    addError: "इस उत्पाद को कार्ट में नहीं जोड़ सके। कृपया फिर से प्रयास करें।",
    ready: "जब आप तैयार हों",
    readyDescription: "अपने चुने हुए विकल्पों की समीक्षा करें और तैयार होने पर उत्पाद को कार्ट में जोड़ें।",
  },
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
  const locale = useLocale()
  const t = translations[locale as keyof typeof translations] || translations.en

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const countryCode = useParams().countryCode as string

  const [options, setOptions] = useState<
    Record<string, string | undefined>
  >({})
  const [isAdding, setIsAdding] = useState(false)
  const [cartMessage, setCartMessage] = useState("")
  const [cartMessageType, setCartMessageType] = useState<"success" | "error" | "">("")

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
    setCartMessageType("")
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
    setCartMessageType("")

    try {
      await addToCart({
        variantId: selectedVariant.id,
        quantity: 1,
        countryCode,
      })

      setCartMessage(t.productAdded)
      setCartMessageType("success")
    } catch (error) {
      console.error("Could not add product to cart:", error)
      setCartMessage(t.addError)
      setCartMessageType("error")
    } finally {
      setIsAdding(false)
    }
  }

  const buttonText = !selectedVariant
    ? t.chooseOptionsButton
    : !inStock
      ? t.outOfStock
      : isAdding
        ? t.adding
        : t.addToCart

  return (
    <>
      <div
        ref={actionsRef}
        className="flex w-full min-w-0 flex-col gap-4 overflow-hidden rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:gap-5 sm:rounded-2xl sm:p-5 md:p-6"
      >
        {/* PURCHASE PANEL HEADING */}
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500 sm:text-xs sm:tracking-[0.18em]">
            {t.yourSelection}
          </p>

          <h3 className="mt-1 break-words text-base font-bold text-[#17283d] sm:text-lg">
            {t.chooseOptions}
          </h3>

          <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm sm:leading-6">
            {t.selectOptionsDescription}
          </p>
        </div>

        <Divider />

        {/* PRODUCT VARIANTS */}
        {(product.variants?.length ?? 0) > 1 && (
          <div className="flex min-w-0 flex-col gap-3 sm:gap-5">
            {(product.options ?? []).map((option) => (
              <div
                key={option.id}
                className="w-full min-w-0 rounded-lg bg-gray-50 p-3 sm:rounded-xl sm:p-4"
              >
                <OptionSelect
                  option={option}
                  current={options[option.id]}
                  updateOption={setOptionValue}
                  title={option.title ?? t.options}
                  data-testid="product-options"
                  disabled={!!disabled || isAdding}
                />
              </div>
            ))}
          </div>
        )}

        {/* SELECTION STATUS */}
        {(product.variants?.length ?? 0) > 1 && !selectedVariant && (
          <p className="break-words rounded-lg bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-800 sm:text-sm">
            {t.selectRequired}
          </p>
        )}

        {selectedVariant && (
          <div
            className={`flex min-w-0 items-start gap-2 rounded-lg px-3 py-2.5 text-xs font-medium sm:items-center sm:text-sm ${
              inStock
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            <span
              aria-hidden="true"
              className={`mt-1 h-2 w-2 shrink-0 rounded-full sm:mt-0 ${
                inStock ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
            <span className="min-w-0 break-words">
              {inStock ? t.available : t.outOfStock}
            </span>
          </div>
        )}

        {/* PRICE */}
        <div className="w-full min-w-0 rounded-lg border border-gray-100 bg-[#f8fafc] p-3 sm:rounded-xl sm:p-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500 sm:text-xs">
            {t.price}
          </p>

          <div className="min-w-0 break-words text-[#17283d]">
            <ProductPrice
              product={product}
              variant={selectedVariant}
            />
          </div>

          <p className="mt-2 text-[11px] leading-5 text-gray-500 sm:text-xs">
            {t.finalPrice}
          </p>
        </div>

        {/* ADD TO CART */}
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
          className="h-12 w-full rounded-xl bg-[#17283d] px-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#243e58] disabled:cursor-not-allowed disabled:opacity-50 sm:h-13"
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

        {/* CART FEEDBACK */}
        {cartMessage && (
          <Text
            role="status"
            aria-live="polite"
            className={`break-words text-xs sm:text-sm ${
              cartMessageType === "success"
                ? "text-emerald-700"
                : "text-red-600"
            }`}
          >
            {cartMessage}
          </Text>
        )}

        {/* HELPFUL INFORMATION */}
        <div className="flex min-w-0 gap-3 rounded-lg border border-gray-100 p-3 sm:rounded-xl">
          <span className="shrink-0 text-lg sm:text-xl" aria-hidden="true">
            🛍️
          </span>

          <div className="min-w-0">
            <p className="break-words text-xs font-semibold text-gray-800 sm:text-sm">
              {t.ready}
            </p>

            <p className="mt-1 break-words text-[11px] leading-5 text-gray-500 sm:text-xs">
              {t.readyDescription}
            </p>
          </div>
        </div>
      </div>

      {/* EXISTING MOBILE PURCHASE ACTIONS */}
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