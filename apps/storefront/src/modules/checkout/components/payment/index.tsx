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
  Heading,
  Text,
  clx,
} from "@modules/common/components/ui"
import { HttpTypes } from "@medusajs/types"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useLocale } from "next-intl"

const translations = {
  en: {
    payment: "Payment",
    chooseMethod: "Choose your preferred payment method",
    ready: "Ready",
    edit: "Edit",
    availableMethods: "Available payment methods",
    selectOption: "Select a payment option to continue.",
    giftCardPayment: "Gift card payment",
    giftCardCovers: "Your gift card covers the order total.",
    enterDetails: "Enter payment details →",
    continueReview: "Continue to review →",
    reviewDetails: "Review your order details before placing your order.",
    paymentMethod: "Payment method",
    paymentDetails: "Payment details",
    anotherStep: "Another step will appear",
    giftCard: "Gift card",
    completePrevious: "Complete the previous checkout steps to continue.",
    unableInitialize: "Unable to initialize payment.",
  },
  te: {
    payment: "చెల్లింపు",
    chooseMethod: "మీకు నచ్చిన చెల్లింపు పద్ధతిని ఎంచుకోండి",
    ready: "సిద్ధంగా ఉంది",
    edit: "మార్చండి",
    availableMethods: "అందుబాటులో ఉన్న చెల్లింపు పద్ధతులు",
    selectOption: "కొనసాగించడానికి చెల్లింపు పద్ధతిని ఎంచుకోండి.",
    giftCardPayment: "గిఫ్ట్ కార్డ్ చెల్లింపు",
    giftCardCovers: "మీ గిఫ్ట్ కార్డ్ ఆర్డర్ మొత్తం ఖర్చును కవర్ చేస్తుంది.",
    enterDetails: "చెల్లింపు వివరాలను నమోదు చేయండి →",
    continueReview: "ఆర్డర్ సమీక్షకు కొనసాగండి →",
    reviewDetails: "ఆర్డర్ చేసే ముందు మీ ఆర్డర్ వివరాలను సమీక్షించండి.",
    paymentMethod: "చెల్లింపు పద్ధతి",
    paymentDetails: "చెల్లింపు వివరాలు",
    anotherStep: "తదుపరి దశ ఇక్కడ కనిపిస్తుంది",
    giftCard: "గిఫ్ట్ కార్డ్",
    completePrevious: "కొనసాగించడానికి మునుపటి చెక్‌అవుట్ దశలను పూర్తి చేయండి.",
    unableInitialize: "చెల్లింపును ప్రారంభించడం సాధ్యం కాలేదు.",
  },
  hi: {
    payment: "भुगतान",
    chooseMethod: "अपनी पसंदीदा भुगतान विधि चुनें",
    ready: "तैयार",
    edit: "बदलें",
    availableMethods: "उपलब्ध भुगतान विधियां",
    selectOption: "जारी रखने के लिए भुगतान विकल्प चुनें।",
    giftCardPayment: "गिफ्ट कार्ड भुगतान",
    giftCardCovers: "आपका गिफ्ट कार्ड ऑर्डर की पूरी राशि कवर करता है।",
    enterDetails: "भुगतान विवरण दर्ज करें →",
    continueReview: "ऑर्डर की समीक्षा जारी रखें →",
    reviewDetails: "ऑर्डर देने से पहले अपने ऑर्डर का विवरण जांचें।",
    paymentMethod: "भुगतान का तरीका",
    paymentDetails: "भुगतान विवरण",
    anotherStep: "अगला चरण यहां दिखाई देगा",
    giftCard: "गिफ्ट कार्ड",
    completePrevious: "जारी रखने के लिए पिछले चेकआउट चरण पूरे करें।",
    unableInitialize: "भुगतान शुरू नहीं किया जा सका।",
  },
}

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: HttpTypes.StoreCart
  availablePaymentMethods: { id: string }[]
}) => {
  const locale = useLocale()
  const t =
    translations[locale as keyof typeof translations] ?? translations.en

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
          err instanceof Error ? err.message : t.unableInitialize
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
    <section className="w-full min-w-0 overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/30 to-blue-50/40 shadow-sm shadow-indigo-100/50">
      <div className="flex flex-col gap-3 border-b border-indigo-100 bg-gradient-to-r from-violet-50 via-indigo-50 to-sky-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-md shadow-indigo-200 sm:h-11 sm:w-11">
            <CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>

          <div className="min-w-0">
            <Heading
              level="h2"
              className="text-lg font-bold text-slate-900 sm:text-xl"
            >
              {t.payment}
            </Heading>

            <Text className="mt-1 text-xs text-slate-500 sm:text-sm">
              {t.chooseMethod}
            </Text>
          </div>
        </div>

        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
          {!isOpen && paymentReady && (
            <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
              <CheckCircleSolid />
              <span>{t.ready}</span>
            </div>
          )}

          {!isOpen && paymentReady && (
            <button
              onClick={handleEdit}
              className="min-h-10 rounded-lg px-4 py-2 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
              data-testid="edit-payment-button"
            >
              {t.edit}
            </button>
          )}
        </div>
      </div>

      <div className="min-w-0 p-4 sm:p-5 md:p-6">
        {isOpen ? (
          <>
            {!paidByGiftcard && !!availablePaymentMethods?.length && (
              <div className="min-w-0 space-y-3">
                <div className="mb-4">
                  <Text className="font-semibold text-slate-800">
                    {t.availableMethods}
                  </Text>

                  <Text className="mt-1 text-xs text-slate-500 sm:text-sm">
                    {t.selectOption}
                  </Text>
                </div>

                <RadioGroup
                  value={selectedPaymentMethod}
                  onChange={(value: string) => setPaymentMethod(value)}
                  className="w-full min-w-0 space-y-3"
                >
                  {availablePaymentMethods.map((paymentMethod) => (
                    <div
                      key={paymentMethod.id}
                      className={clx(
                        "w-full min-w-0 overflow-hidden rounded-xl border bg-white p-3 transition-all duration-200 sm:p-4",
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
                className="flex min-w-0 items-start gap-3 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-3 sm:p-4"
                data-testid="payment-method-summary"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <CheckCircleSolid />
                </span>

                <div className="min-w-0">
                  <Text className="font-semibold text-emerald-900">
                    {t.giftCardPayment}
                  </Text>

                  <Text className="mt-1 text-xs text-emerald-700 sm:text-sm">
                    {t.giftCardCovers}
                  </Text>
                </div>
              </div>
            )}

            <div className="mt-5 min-w-0">
              <ErrorMessage
                error={error}
                data-testid="payment-method-error-message"
              />

              <Button
                size="large"
                className="mt-4 min-h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:from-violet-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleSubmit}
                isLoading={isLoading}
                disabled={
                  (isStripeLike(selectedPaymentMethod) && !paymentComplete) ||
                  (!selectedPaymentMethod && !paidByGiftcard)
                }
                data-testid="submit-payment-button"
              >
                {!activeSession && isStripeLike(selectedPaymentMethod)
                  ? t.enterDetails
                  : t.continueReview}
              </Button>

              <Text className="mt-3 text-center text-xs leading-5 text-slate-500">
                {t.reviewDetails}
              </Text>
            </div>
          </>
        ) : (
          <>
            {cart && paymentReady && activeSession ? (
              <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <div className="min-w-0 rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 to-purple-50 p-3 sm:p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                      <CreditCard className="h-5 w-5" />
                    </span>

                    <Text className="font-semibold text-violet-950">
                      {t.paymentMethod}
                    </Text>
                  </div>

                  <Text
                    className="break-words text-sm font-medium text-violet-800"
                    data-testid="payment-method-summary"
                  >
                    {paymentInfoMap[activeSession.provider_id]?.title ||
                      activeSession.provider_id}
                  </Text>
                </div>

                <div className="min-w-0 rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50 to-blue-50 p-3 sm:p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                      {paymentInfoMap[selectedPaymentMethod]?.icon || (
                        <CreditCard className="h-5 w-5" />
                      )}
                    </span>

                    <Text className="font-semibold text-sky-950">
                      {t.paymentDetails}
                    </Text>
                  </div>

                  <Text
                    className="break-words text-xs text-sky-800 sm:text-sm"
                    data-testid="payment-details-summary"
                  >
                    {t.anotherStep}
                  </Text>
                </div>
              </div>
            ) : paidByGiftcard ? (
              <div className="flex min-w-0 items-center gap-3 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-3 sm:p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <CheckCircleSolid />
                </span>

                <Text
                  className="font-semibold text-emerald-900"
                  data-testid="payment-method-summary"
                >
                  {t.giftCard}
                </Text>
              </div>
            ) : (
              <Text className="text-sm text-slate-500">
                {t.completePrevious}
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
