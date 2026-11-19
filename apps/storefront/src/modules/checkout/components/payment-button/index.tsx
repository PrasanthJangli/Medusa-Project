"use client"

import { isManual, isStripeLike } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import { useParams } from "next/navigation"
import { useLocale } from "next-intl"
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

const translations = {
  en: {
    selectPayment: "Select a payment method",
    openingCashfree: "Opening Cashfree checkout...",
    payCashfree: "Pay with Cashfree →",
    placeOrder: "Place Order →",
    processing: "Processing your order...",
    cashfreeMissing:
      "Cashfree payment session ID is missing. Go back to Payment and select Cashfree again.",
    cashfreeUnavailable: "Cashfree checkout SDK is unavailable.",
    cashfreeLoadError: "Unable to load Cashfree checkout SDK.",
    cashfreeApiError:
      "Cashfree SDK loaded, but the checkout API is unavailable.",
    cashfreeOpenError: "Unable to open Cashfree checkout.",
    paymentFailed: "Payment could not be completed.",
    somethingWrong: "Something went wrong.",
  },
  te: {
    selectPayment: "చెల్లింపు పద్ధతిని ఎంచుకోండి",
    openingCashfree: "Cashfree చెక్‌అవుట్ తెరవబడుతోంది...",
    payCashfree: "Cashfree ద్వారా చెల్లించండి →",
    placeOrder: "ఆర్డర్ చేయండి →",
    processing: "మీ ఆర్డర్ ప్రాసెస్ అవుతోంది...",
    cashfreeMissing:
      "Cashfree చెల్లింపు సెషన్ ID లేదు. Payment విభాగానికి తిరిగి వెళ్లి Cashfreeని మళ్లీ ఎంచుకోండి.",
    cashfreeUnavailable: "Cashfree చెక్‌అవుట్ SDK అందుబాటులో లేదు.",
    cashfreeLoadError: "Cashfree చెక్‌అవుట్ SDK లోడ్ కాలేదు.",
    cashfreeApiError:
      "Cashfree SDK లోడ్ అయింది, కానీ చెక్‌అవుట్ API అందుబాటులో లేదు.",
    cashfreeOpenError: "Cashfree చెక్‌అవుట్ తెరవడం సాధ్యం కాలేదు.",
    paymentFailed: "చెల్లింపు పూర్తి కాలేదు.",
    somethingWrong: "ఏదో సమస్య ఏర్పడింది.",
  },
  hi: {
    selectPayment: "भुगतान का तरीका चुनें",
    openingCashfree: "Cashfree चेकआउट खुल रहा है...",
    payCashfree: "Cashfree से भुगतान करें →",
    placeOrder: "ऑर्डर दें →",
    processing: "आपका ऑर्डर प्रोसेस हो रहा है...",
    cashfreeMissing:
      "Cashfree पेमेंट सेशन ID उपलब्ध नहीं है। Payment सेक्शन पर वापस जाएं और Cashfree दोबारा चुनें।",
    cashfreeUnavailable: "Cashfree चेकआउट SDK उपलब्ध नहीं है।",
    cashfreeLoadError: "Cashfree चेकआउट SDK लोड नहीं हो सका।",
    cashfreeApiError:
      "Cashfree SDK लोड हो गया, लेकिन चेकआउट API उपलब्ध नहीं है।",
    cashfreeOpenError: "Cashfree चेकआउट नहीं खुल सका।",
    paymentFailed: "भुगतान पूरा नहीं हो सका।",
    somethingWrong: "कुछ गलत हो गया।",
  },
}

const placeOrderButtonClass =
  "!w-full !rounded-xl !bg-gradient-to-r !from-violet-600 !via-indigo-600 !to-blue-600 !text-white !font-semibold !shadow-lg !shadow-indigo-200/70 hover:!from-violet-700 hover:!via-indigo-700 hover:!to-blue-700 hover:!shadow-xl transition-all duration-200"

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const locale = useLocale()
  const t =
    translations[locale as keyof typeof translations] ?? translations.en

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
      {t.selectPayment}
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
  const locale = useLocale()
  const t =
    translations[locale as keyof typeof translations] ?? translations.en

  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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
      setErrorMessage(t.cashfreeMissing)
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
              reject(new Error(t.cashfreeApiError))
            }
          }

          const handleError = () => {
            reject(new Error(t.cashfreeLoadError))
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
        throw new Error(t.cashfreeUnavailable)
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
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : t.cashfreeOpenError
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
        {submitting ? t.openingCashfree : t.payCashfree}
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
  const locale = useLocale()
  const t =
    translations[locale as keyof typeof translations] ?? translations.en

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

        setErrorMessage(error.message || t.paymentFailed)
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
        err instanceof Error ? err.message : t.somethingWrong
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
        {submitting ? t.processing : t.placeOrder}
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
  const locale = useLocale()
  const t =
    translations[locale as keyof typeof translations] ?? translations.en

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
        {submitting ? t.processing : t.placeOrder}
      </Button>

      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </div>
  )
}

export default PaymentButton
