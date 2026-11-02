"use client"
import { isManual, isStripeLike } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import { useParams } from "next/navigation"
import React, { useState } from "react"
import ErrorMessage from "../error-message"
declare global {
  interface Window {
    Cashfree?: (options: {
      mode: "sandbox" | "production"
    }) => {
      checkout: (options: {
        paymentSessionId: string
        redirectTarget?: "_self" | "_blank" | "_top"
      }) => Promise<unknown>
    }
  }
}

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

type CashfreePaymentSession = {
  provider_id: string
  status: string
  data?: Record<string, unknown>
}

const placeOrderButtonClass =
  "!w-full !rounded-xl !bg-gradient-to-r !from-violet-600 !via-indigo-600 !to-blue-600 !text-white !font-semibold !shadow-lg !shadow-indigo-200/70 hover:!from-violet-700 hover:!via-indigo-700 hover:!to-blue-700 hover:!shadow-xl transition-all duration-200"

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const paymentSessions =
    cart.payment_collection?.payment_sessions ?? []

  const paymentSession =
    paymentSessions.find((session) => session.status === "pending") ??
    paymentSessions[0]

  const providerId = paymentSession?.provider_id ?? ""

  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  if (providerId.toLowerCase().includes("cashfree")) {
    return (
      <CashfreePaymentButton
        paymentSession={paymentSession as CashfreePaymentSession | undefined}
        notReady={notReady}
        data-testid={dataTestId}
      />
    )
  }

  if (isStripeLike(providerId)) {
    return (
      <StripePaymentButton
        notReady={notReady}
        cart={cart}
        data-testid={dataTestId}
      />
    )
  }

  if (isManual(providerId)) {
    return (
      <ManualTestPaymentButton
        notReady={notReady}
        data-testid={dataTestId}
      />
    )
  }

  return (
    <Button disabled size="large" className="w-full">
      Select a payment method
    </Button>
  )
}

const CashfreePaymentButton = ({
  paymentSession,
  notReady,
  "data-testid": dataTestId,
}: {
  paymentSession: CashfreePaymentSession | undefined
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Explicitly narrow the unknown value to a string.
  const rawPaymentSessionId =
    paymentSession?.data?.payment_session_id

  const paymentSessionId =
    typeof rawPaymentSessionId === "string"
      ? rawPaymentSessionId
      : undefined

  const handlePayment = async () => {
    if (notReady || submitting) {
      return
    }

    setErrorMessage(null)

    if (!paymentSessionId) {
      setErrorMessage(
        "Cashfree payment session ID is missing. Go back to Payment and select Cashfree again."
      )
      return
    }

    setSubmitting(true)

    try {
      const scriptUrl =
        "https://sdk.cashfree.com/js/v3/cashfree.js"

      if (!window.Cashfree) {
        await new Promise<void>((resolve, reject) => {
          const existingScript =
            document.querySelector<HTMLScriptElement>(
              `script[src="${scriptUrl}"]`
            )

          const script =
            existingScript ?? document.createElement("script")

          const handleLoad = () => {
            if (window.Cashfree) {
              resolve()
            } else {
              reject(
                new Error(
                  "Cashfree SDK loaded, but the checkout API is unavailable."
                )
              )
            }
          }

          const handleError = () => {
            reject(
              new Error("Unable to load Cashfree checkout SDK.")
            )
          }

          script.addEventListener("load", handleLoad, {
            once: true,
          })
          script.addEventListener("error", handleError, {
            once: true,
          })

          if (!existingScript) {
            script.src = scriptUrl
            script.async = true
            document.head.appendChild(script)
          } else if (window.Cashfree) {
            resolve()
          }
        })
      }

      if (!window.Cashfree) {
        throw new Error("Cashfree checkout SDK is unavailable.")
      }

      const mode =
        process.env.NEXT_PUBLIC_CASHFREE_ENV === "production"
          ? "production"
          : "sandbox"

      const cashfree = window.Cashfree({ mode })

      await cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_self",
      })

      // Cashfree controls the checkout/redirect.
      // Do not place the order here before verifying payment status.
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to open Cashfree checkout."
      )
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <Button
        disabled={notReady || submitting || !paymentSessionId}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        className={placeOrderButtonClass}
        data-testid={dataTestId}
      >
        {submitting
          ? "Opening Cashfree checkout..."
          : "Pay with Cashfree →"}
      </Button>

      <ErrorMessage
        error={errorMessage}
        data-testid="cashfree-payment-error-message"
      />
    </div>
  )
}

const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const stripe = useStripe()
  const elements = useElements()
  const { countryCode } = useParams()

  const disabled = !stripe || !elements

  const onPaymentCompleted = async () => {
    try {
      await placeOrder()
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : String(err)
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handlePayment = async () => {
    if (!stripe || !elements || !cart || submitting) {
      return
    }

    setSubmitting(true)
    setErrorMessage(null)

    try {
      const { error, paymentIntent } =
        await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/api/payment-return?cart_id=${cart.id}&country_code=${countryCode}`,
            payment_method_data: {
              billing_details: {
                name:
                  `${cart.billing_address?.first_name ?? ""} ${cart.billing_address?.last_name ?? ""}`.trim(),
                address: {
                  city: cart.billing_address?.city ?? undefined,
                  country:
                    cart.billing_address?.country_code ?? undefined,
                  line1:
                    cart.billing_address?.address_1 ?? undefined,
                  line2:
                    cart.billing_address?.address_2 ?? undefined,
                  postal_code:
                    cart.billing_address?.postal_code ?? undefined,
                  state:
                    cart.billing_address?.province ?? undefined,
                },
                email: cart.email,
                phone:
                  cart.billing_address?.phone ?? undefined,
              },
            },
          },
          redirect: "if_required",
        })

      if (error) {
        const paymentIntentFromError = error.payment_intent

        if (
          paymentIntentFromError?.status === "requires_capture" ||
          paymentIntentFromError?.status === "succeeded"
        ) {
          await onPaymentCompleted()
          return
        }

        setErrorMessage(
          error.message || "Payment could not be completed."
        )
        setSubmitting(false)
        return
      }

      if (
        paymentIntent?.status === "requires_capture" ||
        paymentIntent?.status === "succeeded"
      ) {
        await onPaymentCompleted()
        return
      }

      setSubmitting(false)
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      )
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <Button
        disabled={disabled || notReady || submitting}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        className={placeOrderButtonClass}
        data-testid={dataTestId}
      >
        {submitting ? "Processing your order..." : "Place Order →"}
      </Button>

      <ErrorMessage
        error={errorMessage}
        data-testid="stripe-payment-error-message"
      />
    </div>
  )
}

const ManualTestPaymentButton = ({
  notReady,
  "data-testid": dataTestId,
}: {
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    try {
      await placeOrder()
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : String(err)
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handlePayment = () => {
    if (notReady || submitting) {
      return
    }

    setSubmitting(true)
    setErrorMessage(null)
    void onPaymentCompleted()
  }

  return (
    <div className="w-full">
      <Button
        disabled={notReady || submitting}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        className={placeOrderButtonClass}
        data-testid={dataTestId ?? "submit-order-button"}
      >
        {submitting ? "Processing your order..." : "Place Order →"}
      </Button>

      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </div>
  )
}

export default PaymentButton
