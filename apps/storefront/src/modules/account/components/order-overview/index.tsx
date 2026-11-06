
"use client"

import { useLocale } from "next-intl"
import { Button } from "@modules/common/components/ui"
import OrderCard from "../order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

const translations = {
  en: {
    nothing: "Nothing to see here",
    noOrders: "You don't have any orders yet, let us change that :)",
    continueShopping: "Continue shopping",
  },
  te: {
    nothing: "ఇక్కడ ఇంకా ఏమీ లేదు",
    noOrders: "మీరు ఇంకా ఎలాంటి ఆర్డర్లు చేయలేదు. ఇప్పుడే షాపింగ్ ప్రారంభించండి :)",
    continueShopping: "షాపింగ్ కొనసాగించండి",
  },
  hi: {
    nothing: "यहाँ देखने के लिए कुछ नहीं है",
    noOrders: "आपने अभी तक कोई ऑर्डर नहीं किया है। आइए, इसे बदलें :)",
    continueShopping: "खरीदारी जारी रखें",
  },
}

const OrderOverview = ({
  orders,
}: {
  orders: HttpTypes.StoreOrder[]
}) => {
  const locale = useLocale()
  const t =
    translations[locale as keyof typeof translations] ?? translations.en

  if (orders?.length) {
    return (
      <div className="flex w-full flex-col gap-y-8">
        {orders.map((o) => (
          <div
            key={o.id}
            className="border-b border-gray-200 pb-6 last:border-none last:pb-0"
          >
            <OrderCard order={o} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className="flex w-full flex-col items-center gap-y-4"
      data-testid="no-orders-container"
    >
      <h2 className="text-large-semi">{t.nothing}</h2>

      <p className="text-base-regular">{t.noOrders}</p>

      <div className="mt-4">
        <LocalizedClientLink href="/" passHref>
          <Button data-testid="continue-shopping-button">
            {t.continueShopping}
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderOverview
