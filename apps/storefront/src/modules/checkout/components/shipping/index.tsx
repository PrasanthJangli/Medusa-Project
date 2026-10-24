
"use client"

import { Radio, RadioGroup } from "@headlessui/react"
import { setShippingMethod } from "@lib/data/cart"
import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
import { convertToLocale } from "@lib/util/money"
import { CheckCircleSolid, Loader } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import ErrorMessage from "@modules/checkout/components/error-message"
import Divider from "@modules/common/components/divider"
import MedusaRadio from "@modules/common/components/radio"
import { Button, clx, Heading, Text } from "@modules/common/components/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const PICKUP_OPTION_ON = "__PICKUP_ON"
const PICKUP_OPTION_OFF = "__PICKUP_OFF"

type ShippingProps = {
  cart: HttpTypes.StoreCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
}

function formatAddress(address: HttpTypes.StoreCartAddress) {
  if (!address) return ""

  let ret = ""

  if (address.address_1) ret += ` ${address.address_1}`
  if (address.address_2) ret += `, ${address.address_2}`
  if (address.postal_code) ret += `, ${address.postal_code} ${address.city}`
  if (address.country_code) ret += `, ${address.country_code.toUpperCase()}`

  return ret
}

const Shipping: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)
  const [showPickupOptions, setShowPickupOptions] =
    useState<string>(PICKUP_OPTION_OFF)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<
    Record<string, number>
  >({})
  const [error, setError] = useState<string | null>(null)
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    cart.shipping_methods?.at(-1)?.shipping_option_id || null
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const isOpen = searchParams.get("step") === "delivery"

  const _shippingMethods = availableShippingMethods?.filter(
    (sm) =>
      (
        sm as unknown as {
          service_zone?: { fulfillment_set?: { type?: string } }
        }
      ).service_zone?.fulfillment_set?.type !== "pickup"
  )

  const _pickupMethods = availableShippingMethods?.filter(
    (sm) =>
      (
        sm as unknown as {
          service_zone?: { fulfillment_set?: { type?: string } }
        }
      ).service_zone?.fulfillment_set?.type === "pickup"
  )

  const hasPickupOptions = !!_pickupMethods?.length

  useEffect(() => {
    let active = true
    setIsLoadingPrices(true)

    const calculatedOptions =
      _shippingMethods?.filter((sm) => sm.price_type === "calculated") ?? []

    if (!calculatedOptions.length) {
      setIsLoadingPrices(false)
      return () => {
        active = false
      }
    }

    Promise.allSettled(
      calculatedOptions.map((sm) =>
        calculatePriceForShippingOption(sm.id, cart.id)
      )
    ).then((results) => {
      if (!active) return

      const pricesMap: Record<string, number> = {}

      results.forEach((result) => {
        if (result.status === "fulfilled" && result.value?.id) {
          pricesMap[result.value.id] = result.value.amount ?? 0
        }
      })

      setCalculatedPricesMap(pricesMap)
      setIsLoadingPrices(false)
    })

    return () => {
      active = false
    }
  }, [availableShippingMethods, cart.id])

  useEffect(() => {
    if (_pickupMethods?.some((method) => method.id === shippingMethodId)) {
      setShowPickupOptions(PICKUP_OPTION_ON)
    } else {
      setShowPickupOptions(PICKUP_OPTION_OFF)
    }
  }, [availableShippingMethods, shippingMethodId])

  const handleEdit = () => {
    router.push(pathname + "?step=delivery", { scroll: false })
  }

  const handleSubmit = () => {
    router.push(pathname + "?step=payment", { scroll: false })
  }

  const handleSetShippingMethod = async (
    id: string,
    variant: "shipping" | "pickup"
  ) => {
    setError(null)
    setShowPickupOptions(
      variant === "pickup" ? PICKUP_OPTION_ON : PICKUP_OPTION_OFF
    )

    const previousId = shippingMethodId
    setShippingMethodId(id)
    setIsLoading(true)

    try {
      await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
    } catch (err) {
      setShippingMethodId(previousId)
      setError(
        err instanceof Error ? err.message : "Unable to update delivery method."
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  const renderPrice = (option: HttpTypes.StoreCartShippingOption) => {
    if (option.price_type === "flat") {
      return convertToLocale({
        amount: option.amount!,
        currency_code: cart.currency_code,
      })
    }

    const calculatedPrice = calculatedPricesMap[option.id]

    if (typeof calculatedPrice === "number") {
      return convertToLocale({
        amount: calculatedPrice,
        currency_code: cart.currency_code,
      })
    }

    return isLoadingPrices ? <Loader className="animate-spin" /> : "-"
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/40 to-sky-50/60 shadow-sm shadow-indigo-100/60">
      {/* Section heading */}
      <div className="flex items-center justify-between gap-3 border-b border-indigo-100 bg-gradient-to-r from-violet-50 via-indigo-50 to-sky-50 px-5 py-5 small:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-md shadow-indigo-200">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7h11v11H3zM14 11h4l3 4v3h-7z"
              />
              <circle cx="7.5" cy="18" r="1.5" />
              <circle cx="17.5" cy="18" r="1.5" />
            </svg>
          </div>

          <div>
            <Heading
              level="h2"
              className={clx("text-xl font-bold text-slate-900", {
                "opacity-50": !isOpen && !cart.shipping_methods?.length,
              })}
            >
              Delivery
            </Heading>
            <Text className="mt-1 text-sm text-slate-500">
              Choose how you want your order delivered
            </Text>
          </div>
        </div>

        {!isOpen && (cart.shipping_methods?.length ?? 0) > 0 && (
          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
            <CheckCircleSolid />
            <span className="hidden small:inline">Selected</span>
          </div>
        )}

        {!isOpen &&
          cart.shipping_address &&
          cart.billing_address &&
          cart.email && (
            <button
              onClick={handleEdit}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
              data-testid="edit-delivery-button"
            >
              Edit
            </button>
          )}
      </div>

      <div className="p-5 small:p-6">
        {isOpen ? (
          <>
            <div className="mb-5">
              <Text className="font-semibold text-slate-800">
                Shipping method
              </Text>
              <Text className="mt-1 text-sm text-slate-500">
                Select your preferred delivery option below.
              </Text>
            </div>

            <div data-testid="delivery-options-container" className="space-y-3">
              {hasPickupOptions && (
                <RadioGroup
                  value={showPickupOptions}
                  onChange={() => {
                    const id = _pickupMethods?.find(
                      (option) => !option.insufficient_inventory
                    )?.id

                    if (id) handleSetShippingMethod(id, "pickup")
                  }}
                  className="mb-3"
                >
                  <Radio
                    value={PICKUP_OPTION_ON}
                    data-testid="delivery-option-radio"
                    className={clx(
                      "flex cursor-pointer items-center justify-between gap-3 rounded-xl border bg-white p-4 transition-all hover:border-violet-300 hover:shadow-md",
                      showPickupOptions === PICKUP_OPTION_ON
                        ? "border-violet-500 bg-violet-50 ring-2 ring-violet-100"
                        : "border-slate-200"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <MedusaRadio
                        checked={showPickupOptions === PICKUP_OPTION_ON}
                      />
                      <div>
                        <Text className="font-semibold text-slate-800">
                          Pick up your order
                        </Text>
                        <Text className="mt-1 text-xs text-slate-500">
                          Collect your order from a pickup location
                        </Text>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-violet-700">
                      —
                    </span>
                  </Radio>
                </RadioGroup>
              )}

              <RadioGroup
                value={shippingMethodId}
                onChange={(value) => {
                  if (value) handleSetShippingMethod(value, "shipping")
                }}
                className="space-y-3"
              >
                {_shippingMethods?.map((option) => {
                  const selected = option.id === shippingMethodId
                  const isDisabled =
                    option.price_type === "calculated" &&
                    !isLoadingPrices &&
                    typeof calculatedPricesMap[option.id] !== "number"

                  return (
                    <Radio
                      key={option.id}
                      value={option.id}
                      disabled={isDisabled || isLoading}
                      data-testid="delivery-option-radio"
                      className={clx(
                        "flex items-center justify-between gap-3 rounded-xl border p-4 transition-all duration-200",
                        selected
                          ? "border-violet-500 bg-gradient-to-r from-violet-50 to-blue-50 shadow-md ring-2 ring-violet-100"
                          : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm",
                        isDisabled || isLoading
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer"
                      )}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <MedusaRadio checked={selected} />
                        <div className="min-w-0">
                          <Text className="font-semibold text-slate-800">
                            {option.name}
                          </Text>
                          <Text className="mt-1 text-xs text-slate-500">
                            {selected
                              ? "Selected delivery method"
                              : "Choose this delivery option"}
                          </Text>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <Text
                          className={clx(
                            "font-bold",
                            selected ? "text-violet-700" : "text-slate-700"
                          )}
                        >
                          {renderPrice(option)}
                        </Text>
                        {selected && (
                          <Text className="mt-1 text-xs font-medium text-emerald-600">
                            Selected
                          </Text>
                        )}
                      </div>
                    </Radio>
                  )
                })}
              </RadioGroup>
            </div>

            {showPickupOptions === PICKUP_OPTION_ON && (
              <div className="mt-6 rounded-xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-4">
                <Text className="mb-1 font-semibold text-orange-950">
                  Choose a pickup location
                </Text>
                <Text className="mb-4 text-sm text-orange-800">
                  Select an available store for collection.
                </Text>

                <RadioGroup
                  value={shippingMethodId}
                  onChange={(value) => {
                    if (value) handleSetShippingMethod(value, "pickup")
                  }}
                  className="space-y-3"
                >
                  {_pickupMethods?.map((option) => {
                    const selected = option.id === shippingMethodId

                    return (
                      <Radio
                        key={option.id}
                        value={option.id}
                        disabled={!!option.insufficient_inventory || isLoading}
                        data-testid="delivery-option-radio"
                        className={clx(
                          "flex items-start justify-between gap-3 rounded-xl border bg-white p-4 transition-all",
                          selected
                            ? "border-orange-400 ring-2 ring-orange-100"
                            : "border-orange-100 hover:border-orange-300",
                          option.insufficient_inventory || isLoading
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer"
                        )}
                      >
                        <div className="flex min-w-0 items-start gap-3">
                          <MedusaRadio checked={selected} />
                          <div>
                            <Text className="font-semibold text-slate-800">
                              {option.name}
                            </Text>
                            <Text className="mt-1 text-sm text-slate-500">
                              {formatAddress(
                                (
                                  option as unknown as {
                                    service_zone?: {
                                      fulfillment_set?: {
                                        location?: {
                                          address: HttpTypes.StoreCartAddress
                                        }
                                      }
                                    }
                                  }
                                ).service_zone?.fulfillment_set?.location
                                  ?.address as HttpTypes.StoreCartAddress
                              )}
                            </Text>
                          </div>
                        </div>
                        <Text className="shrink-0 font-bold text-orange-700">
                          {convertToLocale({
                            amount: option.amount!,
                            currency_code: cart.currency_code,
                          })}
                        </Text>
                      </Radio>
                    )
                  })}
                </RadioGroup>
              </div>
            )}

            <div className="mt-6">
              <ErrorMessage
                error={error}
                data-testid="delivery-option-error-message"
              />

              <Button
                size="large"
                className="mt-4 w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:from-violet-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleSubmit}
                isLoading={isLoading}
                disabled={
                  !cart.shipping_methods?.length ||
                  isLoading ||
                  !shippingMethodId
                }
                data-testid="submit-delivery-option-button"
              >
                Continue to payment →
              </Button>

              <Text className="mt-3 text-center text-xs text-slate-500">
                You can review your order before completing your purchase.
              </Text>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-4">
            {cart.shipping_methods?.length ? (
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <CheckCircleSolid />
                </span>
                <div>
                  <Text className="font-semibold text-emerald-950">
                    Delivery method selected
                  </Text>
                  <Text className="mt-1 text-sm text-emerald-800">
                    {cart.shipping_methods.at(-1)!.name}
                  </Text>
                  <Text className="mt-1 font-bold text-emerald-700">
                    {convertToLocale({
                      amount: cart.shipping_methods.at(-1)!.amount!,
                      currency_code: cart.currency_code,
                    })}
                  </Text>
                </div>
              </div>
            ) : (
              <Text className="text-sm text-slate-500">
                Select a delivery method to continue.
              </Text>
            )}
          </div>
        )}
      </div>

      <Divider className="mx-5 !my-0 small:mx-6" />
      <div className="h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-400" />
    </section>
  )
}

export default Shipping
