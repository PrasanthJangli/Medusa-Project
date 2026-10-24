
"use client"

import { RadioGroup } from "@headlessui/react"
import { isStripeLike, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer, {
  StripePaymentContainer,
} from "@modules/checkout/components/payment-container"
import Divider from "@modules/common/components/divider"
import {
  Button,
  Container,
  Heading,
  Text,
  clx,
} from "@modules/common/components/ui"
import { HttpTypes } from "@medusajs/types"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: HttpTypes.StoreCart
  availablePaymentMethods: { id: string }[]
}) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const isOpen = searchParams.get("step") === "payment"

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)

    if (isStripeLike(method)) {
      try {
        await initiatePaymentSession(cart, { provider_id: method })
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to initialize payment."
        )
      }
    }
  }

  const paidByGiftcard = !!(
    (cart as unknown as Record<string, unknown>)?.gift_cards &&
    (
      (cart as unknown as Record<string, unknown>)
        ?.gift_cards as unknown[]
    )?.length > 0 &&
    cart?.total === 0
  )

  const paymentReady =
    (!!activeSession && (cart?.shipping_methods?.length ?? 0) !== 0) ||
    paidByGiftcard

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const shouldInputPaymentDetails =
        isStripeLike(selectedPaymentMethod) && !activeSession

      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession && !paidByGiftcard) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }

      if (!shouldInputPaymentDetails) {
        router.push(
          pathname + "?" + createQueryString("step", "review"),
          { scroll: false }
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <section className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/30 to-blue-50/40 shadow-sm shadow-indigo-100/50">
      {/* Payment header */}
      <div className="flex items-center justify-between gap-3 border-b border-indigo-100 bg-gradient-to-r from-violet-50 via-indigo-50 to-sky-50 px-5 py-5 small:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-md shadow-indigo-200">
            <CreditCard className="h-6 w-6" />
          </div>

          <div>
            <Heading level="h2" className="text-xl font-bold text-slate-900">
              Payment
            </Heading>
            <Text className="mt-1 text-sm text-slate-500">
              Choose your preferred payment method
            </Text>
          </div>
        </div>

        {!isOpen && paymentReady && (
          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
            <CheckCircleSolid />
            <span className="hidden small:inline">Ready</span>
          </div>
        )}

        {!isOpen && paymentReady && (
          <button
            onClick={handleEdit}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
            data-testid="edit-payment-button"
          >
            Edit
          </button>
        )}
      </div>

      <div className="p-5 small:p-6">
        {isOpen ? (
          <>
            {!paidByGiftcard && !!availablePaymentMethods?.length && (
              <div className="space-y-3">
                <div className="mb-4">
                  <Text className="font-semibold text-slate-800">
                    Available payment methods
                  </Text>
                  <Text className="mt-1 text-sm text-slate-500">
                    Select a payment option to continue.
                  </Text>
                </div>

                <RadioGroup
                  value={selectedPaymentMethod}
                  onChange={(value: string) => setPaymentMethod(value)}
                  className="space-y-3"
                >
                  {availablePaymentMethods.map((paymentMethod) => (
                    <div
                      key={paymentMethod.id}
                      className={clx(
                        "rounded-xl border bg-white p-3 transition-all duration-200 small:p-4",
                        selectedPaymentMethod === paymentMethod.id
                          ? "border-violet-400 bg-gradient-to-r from-violet-50 to-blue-50 shadow-md ring-2 ring-violet-100"
                          : "border-slate-200 hover:border-indigo-300 hover:shadow-sm"
                      )}
                    >
                      {isStripeLike(paymentMethod.id) ? (
                        <StripePaymentContainer
                          paymentProviderId={paymentMethod.id}
                          selectedPaymentOptionId={selectedPaymentMethod}
                          paymentInfoMap={paymentInfoMap}
                          setError={setError}
                          setPaymentComplete={setPaymentComplete}
                        />
                      ) : (
                        <PaymentContainer
                          paymentInfoMap={paymentInfoMap}
                          paymentProviderId={paymentMethod.id}
                          selectedPaymentOptionId={selectedPaymentMethod}
                        />
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {paidByGiftcard && (
              <div
                className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-4"
                data-testid="payment-method-summary"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <CheckCircleSolid />
                </span>
                <div>
                  <Text className="font-semibold text-emerald-900">
                    Gift card payment
                  </Text>
                  <Text className="mt-1 text-sm text-emerald-700">
                    Your gift card covers the order total.
                  </Text>
                </div>
              </div>
            )}

            <div className="mt-5">
              <ErrorMessage
                error={error}
                data-testid="payment-method-error-message"
              />

              <Button
                size="large"
                className="mt-4 w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:from-violet-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleSubmit}
                isLoading={isLoading}
                disabled={
                  (isStripeLike(selectedPaymentMethod) && !paymentComplete) ||
                  (!selectedPaymentMethod && !paidByGiftcard)
                }
                data-testid="submit-payment-button"
              >
                {!activeSession && isStripeLike(selectedPaymentMethod)
                  ? "Enter payment details →"
                  : "Continue to review →"}
              </Button>

              <Text className="mt-3 text-center text-xs text-slate-500">
                Review your order details before placing your order.
              </Text>
            </div>
          </>
        ) : (
          <>
            {cart && paymentReady && activeSession ? (
              <div className="grid grid-cols-1 gap-4 small:grid-cols-2">
                <div className="rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 to-purple-50 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                      <CreditCard className="h-5 w-5" />
                    </span>
                    <Text className="font-semibold text-violet-950">
                      Payment method
                    </Text>
                  </div>
                  <Text
                    className="text-sm font-medium text-violet-800"
                    data-testid="payment-method-summary"
                  >
                    {paymentInfoMap[activeSession.provider_id]?.title ||
                      activeSession.provider_id}
                  </Text>
                </div>

                <div className="rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50 to-blue-50 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                      {paymentInfoMap[selectedPaymentMethod]?.icon || (
                        <CreditCard className="h-5 w-5" />
                      )}
                    </span>
                    <Text className="font-semibold text-sky-950">
                      Payment details
                    </Text>
                  </div>
                  <Text
                    className="text-sm text-sky-800"
                    data-testid="payment-details-summary"
                  >
                    Another step will appear
                  </Text>
                </div>
              </div>
            ) : paidByGiftcard ? (
              <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-4">
                <Text
                  className="font-semibold text-emerald-900"
                  data-testid="payment-method-summary"
                >
                  Gift card
                </Text>
              </div>
            ) : (
              <Text className="text-sm text-slate-500">
                Complete the previous checkout steps to continue.
              </Text>
            )}
          </>
        )}
      </div>

      <div className="h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-400" />
      <Divider className="!my-0" />
    </section>
  )
}

export default Payment
