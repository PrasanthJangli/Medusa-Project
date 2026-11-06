"use client"

import { useState } from "react"
import { useLocale } from "next-intl"

import { Table, Text, clx } from "@modules/common/components/ui"
import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { translateProductName } from "@lib/util/translate-product"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const locale = useLocale()

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory
    ? 10
    : maxQtyFromInventory

  const productTitle = translateProductName(
    item.product_title || "",
    locale
  )

  return (
    <Table.Row className="w-full" data-testid="product-row">
      <Table.Cell
        className={clx(
          "!pl-0 align-top",
          type === "preview"
            ? "w-[68px] p-2"
            : "w-[76px] p-2 sm:w-28 sm:p-4"
        )}
      >
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className={clx("flex w-full", {
            "w-14 sm:w-16": type === "preview",
            "w-14 sm:w-20": type === "full",
          })}
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
          />
        </LocalizedClientLink>
      </Table.Cell>

      <Table.Cell className="min-w-0 p-2 text-left align-top sm:p-4">
        <div className="min-w-0">
          <Text
            className="txt-medium-plus break-words text-ui-fg-base"
            data-testid="product-title"
          >
            {productTitle}
          </Text>

          <div className="mt-1 min-w-0 break-words">
            <LineItemOptions
              variant={item.variant}
              data-testid="product-variant"
            />
          </div>

          {type === "full" && (
            <div className="mt-2 sm:hidden">
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </div>
          )}

          {type === "full" && (
            <div className="mt-3 flex flex-wrap items-center gap-2 sm:hidden">
              <DeleteButton
                id={item.id}
                data-testid="product-delete-button"
              />

              <CartItemSelect
                value={item.quantity}
                onChange={(value) =>
                  changeQuantity(parseInt(value.target.value))
                }
                className="h-10 w-16 p-2"
                data-testid="product-select-button"
              >
                {Array.from(
                  { length: Math.min(maxQuantity, 10) },
                  (_, i) => (
                    <option value={i + 1} key={i}>
                      {i + 1}
                    </option>
                  )
                )}
              </CartItemSelect>

              {updating && <Spinner />}
            </div>
          )}
        </div>
      </Table.Cell>

      {type === "full" && (
        <Table.Cell className="hidden align-top p-2 sm:table-cell sm:p-4">
          <div className="flex w-full items-center gap-2">
            <DeleteButton
              id={item.id}
              data-testid="product-delete-button"
            />

            <CartItemSelect
              value={item.quantity}
              onChange={(value) =>
                changeQuantity(parseInt(value.target.value))
              }
              className="h-10 w-16 p-2"
              data-testid="product-select-button"
            >
              {Array.from(
                { length: Math.min(maxQuantity, 10) },
                (_, i) => (
                  <option value={i + 1} key={i}>
                    {i + 1}
                  </option>
                )
              )}
            </CartItemSelect>

            {updating && <Spinner />}
          </div>

          <ErrorMessage
            error={error}
            data-testid="product-error-message"
          />
        </Table.Cell>
      )}

      {type === "full" && (
        <Table.Cell className="hidden align-top p-2 sm:table-cell sm:p-4">
          <LineItemUnitPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </Table.Cell>
      )}

      <Table.Cell className="!pr-0 p-2 text-right align-top sm:p-4">
        <span
          className={clx("!pr-0", {
            "flex h-full flex-col items-end justify-center":
              type === "preview",
          })}
        >
          {type === "preview" && (
            <span className="flex flex-wrap justify-end gap-x-1">
              <Text className="text-ui-fg-muted">
                {item.quantity}x
              </Text>

              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </span>
          )}

          <LineItemPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </span>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item