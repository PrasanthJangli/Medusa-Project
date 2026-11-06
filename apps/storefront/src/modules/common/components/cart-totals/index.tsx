"use client"

import { convertToLocale } from "@lib/util/money"
import { useLocale } from "next-intl"
import React from "react"

type CartTotalsProps = {
  totals: {
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    currency_code: string
    item_subtotal?: number | null
    shipping_subtotal?: number | null
    discount_subtotal?: number | null
  }
}

const translations = {
  en: {
    subtotal: "Subtotal (excl. shipping and taxes)",
    shipping: "Shipping",
    discount: "Discount",
    taxes: "Taxes",
    total: "Total",
  },
  te: {
    subtotal: "ఉప మొత్తం (షిప్పింగ్ మరియు పన్నులు మినహా)",
    shipping: "షిప్పింగ్",
    discount: "డిస్కౌంట్",
    taxes: "పన్నులు",
    total: "మొత్తం",
  },
  hi: {
    subtotal: "उप-योग (शिपिंग और टैक्स छोड़कर)",
    shipping: "शिपिंग",
    discount: "छूट",
    taxes: "टैक्स",
    total: "कुल",
  },
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const locale = useLocale()
  const t =
    translations[locale as keyof typeof translations] ?? translations.en

  const {
    currency_code,
    total,
    tax_total,
    item_subtotal,
    shipping_subtotal,
    discount_subtotal,
  } = totals

  return (
    <div>
      <div className="flex flex-col gap-y-2 txt-medium text-ui-fg-subtle">
        <div className="flex items-center justify-between">
          <span>{t.subtotal}</span>
          <span data-testid="cart-subtotal" data-value={item_subtotal || 0}>
            {convertToLocale({ amount: item_subtotal ?? 0, currency_code })}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>{t.shipping}</span>
          <span data-testid="cart-shipping" data-value={shipping_subtotal || 0}>
            {convertToLocale({
              amount: shipping_subtotal ?? 0,
              currency_code,
            })}
          </span>
        </div>

        {!!discount_subtotal && (
          <div className="flex items-center justify-between">
            <span>{t.discount}</span>
            <span
              className="text-ui-fg-interactive"
              data-testid="cart-discount"
              data-value={discount_subtotal || 0}
            >
              -{" "}
              {convertToLocale({
                amount: discount_subtotal ?? 0,
                currency_code,
              })}
            </span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="flex items-center gap-x-1">{t.taxes}</span>
          <span data-testid="cart-taxes" data-value={tax_total || 0}>
            {convertToLocale({ amount: tax_total ?? 0, currency_code })}
          </span>
        </div>
      </div>

      <div className="my-4 h-px w-full border-b border-gray-200" />

      <div className="mb-2 flex items-center justify-between text-ui-fg-base txt-medium">
        <span>{t.total}</span>
        <span
          className="txt-xlarge-plus"
          data-testid="cart-total"
          data-value={total || 0}
        >
          {convertToLocale({ amount: total ?? 0, currency_code })}
        </span>
      </div>

      <div className="mt-4 h-px w-full border-b border-gray-200" />
    </div>
  )
}

export default CartTotals