"use client"

import { Button, Heading } from "@modules/common/components/ui"
import { useLocale } from "next-intl"

import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart
}

const translations = {
  en: {
    summary: "Summary",
    checkout: "Go to checkout",
  },
  te: {
    summary: "ఆర్డర్ సారాంశం",
    checkout: "చెక్అవుట్‌కు వెళ్లండి",
  },
  hi: {
    summary: "ऑर्डर का सारांश",
    checkout: "चेकआउट पर जाएं",
  },
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)
  const locale = useLocale()

  const t =
    translations[locale as keyof typeof translations] ?? translations.en

  return (
    <div className="flex flex-col gap-y-4">
      <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
        {t.summary}
      </Heading>

      <DiscountCode cart={cart} />

      <Divider />

      <CartTotals totals={cart} />

      <LocalizedClientLink
        href={"/checkout?step=" + step}
        data-testid="checkout-button"
      >
        <Button className="h-10 w-full">{t.checkout}</Button>
      </LocalizedClientLink>
    </div>
  )
}

export default Summary