
"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { translateProductName } from "@lib/util/translate-product"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { useLocale } from "next-intl"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"

const cartTranslations = {
  en: {
    cart: "Cart",
    quantity: "Quantity",
    remove: "Remove",
    subtotal: "Subtotal",
    exclTaxes: "(excl. taxes)",
    goToCart: "Go to cart",
    empty: "Your shopping bag is empty.",
    allProducts: "Go to all products page",
    explore: "Explore products",
  },
  te: {
    cart: "కార్ట్",
    quantity: "పరిమాణం",
    remove: "తొలగించు",
    subtotal: "మొత్తం",
    exclTaxes: "(పన్నులు మినహాయించి)",
    goToCart: "కార్ట్‌కు వెళ్లండి",
    empty: "మీ షాపింగ్ బ్యాగ్ ఖాళీగా ఉంది.",
    allProducts: "అన్ని ఉత్పత్తుల పేజీకి వెళ్లండి",
    explore: "ఉత్పత్తులను చూడండి",
  },
  hi: {
    cart: "कार्ट",
    quantity: "मात्रा",
    remove: "हटाएं",
    subtotal: "उप-योग",
    exclTaxes: "(करों को छोड़कर)",
    goToCart: "कार्ट पर जाएं",
    empty: "आपका शॉपिंग बैग खाली है।",
    allProducts: "सभी उत्पादों के पेज पर जाएं",
    explore: "उत्पाद देखें",
  },
}

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const locale = useLocale()
  const labels =
    cartTranslations[locale as keyof typeof cartTranslations] ??
    cartTranslations.en

  const [activeTimer, setActiveTimer] = useState<
    ReturnType<typeof setTimeout> | undefined
  >(undefined)

  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()
    const timer = setTimeout(close, 5000)
    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }
    open()
  }

  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()

  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }

    itemRef.current = totalItems
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, pathname])

  return (
    <div
      className="z-50 h-full"
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <Popover className="relative h-full">
        <PopoverButton className="h-full">
          <LocalizedClientLink
            className="hover:text-ui-fg-base"
            href="/cart"
            data-testid="nav-cart-link"
          >
            {labels.cart} ({totalItems})
          </LocalizedClientLink>
        </PopoverButton>

        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel
            static
            className="absolute right-0 top-[calc(100%+1px)] hidden w-[420px] border-x border-b border-gray-200 bg-white text-ui-fg-base small:block"
            data-testid="nav-cart-dropdown"
          >
            <div className="flex items-center justify-center p-4">
              <h3 className="text-large-semi">{labels.cart}</h3>
            </div>

            {cartState && cartState.items?.length ? (
              <>
                <div className="grid max-h-[402px] grid-cols-1 gap-y-8 overflow-y-scroll px-4 p-px no-scrollbar">
                  {cartState.items
                    .sort((a, b) =>
                      (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                    )
                    .map((item) => (
                      <div
                        className="grid grid-cols-[122px_1fr] gap-x-4"
                        key={item.id}
                        data-testid="cart-item"
                      >
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                          className="w-24"
                        >
                          <Thumbnail
                            thumbnail={item.thumbnail}
                            images={item.variant?.product?.images}
                            size="square"
                          />
                        </LocalizedClientLink>

                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex flex-1 flex-col">
                            <div className="flex items-start justify-between">
                              <div className="mr-4 flex w-[180px] flex-col overflow-ellipsis whitespace-nowrap">
                                <h3 className="text-base-regular overflow-hidden text-ellipsis">
                                  <LocalizedClientLink
                                    href={`/products/${item.product_handle}`}
                                    data-testid="product-link"
                                  >
                                    {translateProductName(item.title, locale)}
                                  </LocalizedClientLink>
                                </h3>

                                <LineItemOptions
                                  variant={item.variant}
                                  data-testid="cart-item-variant"
                                  data-value={item.variant}
                                />

                                <span
                                  data-testid="cart-item-quantity"
                                  data-value={item.quantity}
                                >
                                  {labels.quantity}: {item.quantity}
                                </span>
                              </div>

                              <div className="flex justify-end">
                                <LineItemPrice
                                  item={item}
                                  style="tight"
                                  currencyCode={cartState.currency_code}
                                />
                              </div>
                            </div>
                          </div>

                          <DeleteButton
                            id={item.id}
                            className="mt-1"
                            data-testid="cart-item-remove-button"
                          >
                            {labels.remove}
                          </DeleteButton>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="flex flex-col gap-y-4 p-4 text-small-regular">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ui-fg-base">
                      {labels.subtotal}{" "}
                      <span className="font-normal">
                        {labels.exclTaxes}
                      </span>
                    </span>

                    <span
                      className="text-large-semi"
                      data-testid="cart-subtotal"
                      data-value={subtotal}
                    >
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cartState.currency_code,
                      })}
                    </span>
                  </div>

                  <LocalizedClientLink href="/cart" passHref>
                    <Button
                      className="w-full"
                      size="large"
                      data-testid="go-to-cart-button"
                    >
                      {labels.goToCart}
                    </Button>
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div>
                <div className="flex flex-col items-center justify-center gap-y-4 py-16">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-small-regular text-white">
                    <span>0</span>
                  </div>

                  <span>{labels.empty}</span>

                  <div>
                    <LocalizedClientLink href="/store">
                      <>
                        <span className="sr-only">{labels.allProducts}</span>
                        <Button onClick={close}>{labels.explore}</Button>
                      </>
                    </LocalizedClientLink>
                  </div>
                </div>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown
