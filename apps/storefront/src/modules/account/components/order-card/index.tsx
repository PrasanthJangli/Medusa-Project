
"use client"

import { Button } from "@modules/common/components/ui"
import { useMemo } from "react"
import { useLocale } from "next-intl"

import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const translations = {
  en: {
    item: "item",
    items: "items",
    more: "more",
    seeDetails: "See details",
  },
  te: {
    item: "వస్తువు",
    items: "వస్తువులు",
    more: "మరిన్ని",
    seeDetails: "వివరాలు చూడండి",
  },
  hi: {
    item: "वस्तु",
    items: "वस्तुएँ",
    more: "और",
    seeDetails: "विवरण देखें",
  },
}

const OrderCard = ({ order }: OrderCardProps) => {
  const locale = useLocale()

  const t =
    translations[locale as keyof typeof translations] ?? translations.en

  const numberOfLines = useMemo(() => {
    return (
      order.items?.reduce((acc, item) => {
        return acc + item.quantity
      }, 0) ?? 0
    )
  }, [order])

  const numberOfProducts = useMemo(() => {
    return order.items?.length ?? 0
  }, [order])

  return (
    <div className="flex flex-col bg-white" data-testid="order-card">
      <div className="mb-1 text-large-semi uppercase">
        #<span data-testid="order-display-id">{order.display_id}</span>
      </div>

      <div className="flex items-center divide-x divide-gray-200 text-small-regular text-ui-fg-base">
        <span className="pr-2" data-testid="order-created-at">
          {new Date(order.created_at).toLocaleDateString(locale)}
        </span>

        <span className="px-2" data-testid="order-amount">
          {convertToLocale({
            amount: order.total,
            currency_code: order.currency_code,
          })}
        </span>

        <span className="pl-2">
          {numberOfLines}{" "}
          {numberOfLines > 1 ? t.items : t.item}
        </span>
      </div>

      <div className="my-4 grid grid-cols-2 gap-4 small:grid-cols-4">
        {order.items?.slice(0, 3).map((i) => (
          <div
            key={i.id}
            className="flex flex-col gap-y-2"
            data-testid="order-item"
          >
            <Thumbnail thumbnail={i.thumbnail} images={[]} size="full" />

            <div className="flex items-center text-small-regular text-ui-fg-base">
              <span
                className="font-semibold text-ui-fg-base"
                data-testid="item-title"
              >
                {i.title}
              </span>

              <span className="ml-2">x</span>

              <span data-testid="item-quantity">{i.quantity}</span>
            </div>
          </div>
        ))}

        {numberOfProducts > 4 && (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <span className="text-small-regular text-ui-fg-base">
              + {numberOfLines - 4}
            </span>

            <span className="text-small-regular text-ui-fg-base">
              {t.more}
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <LocalizedClientLink href={`/account/orders/details/${order.id}`}>
          <Button data-testid="order-details-link" variant="secondary">
            {t.seeDetails}
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderCard
