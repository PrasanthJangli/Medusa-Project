
"use client"

import { Heading, Text, clx } from "@modules/common/components/ui"
import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"
import { useLocale } from "next-intl"
import { HttpTypes } from "@medusajs/types"

const translations = {
  en: {
    title: "Review Your Order",
    description: "Check everything before placing your order.",
    ready: "Ready to order",
    terms: "Terms & Conditions",
    termsText:
      "By clicking the Place Order button, you confirm that you have read, understand and accept our Terms of Use, Terms of Sale and Returns Policy and acknowledge that you have read Medusa Store's Privacy Policy.",
    everythingGood: "Everything looks good?",
    placeOrderText: "Place your order to continue with checkout.",
    orderReview: "Order review",
    completeSteps:
      "Complete your delivery and payment steps to place your order.",
  },
  te: {
    title: "మీ ఆర్డర్‌ను సమీక్షించండి",
    description: "ఆర్డర్ చేయడానికి ముందు అన్ని వివరాలను తనిఖీ చేయండి.",
    ready: "ఆర్డర్ చేయడానికి సిద్ధంగా ఉంది",
    terms: "నిబంధనలు మరియు షరతులు",
    termsText:
      "Place Order బటన్‌ను క్లిక్ చేయడం ద్వారా, మీరు మా వినియోగ నిబంధనలు, అమ్మకాల నిబంధనలు మరియు రిటర్న్స్ పాలసీని చదివి, అర్థం చేసుకుని, అంగీకరించినట్లు నిర్ధారిస్తారు. అలాగే Medusa Store గోప్యతా విధానాన్ని చదివినట్లు అంగీకరిస్తారు.",
    everythingGood: "అన్నీ సరిగ్గా ఉన్నాయా?",
    placeOrderText: "చెక్‌అవుట్ కొనసాగించడానికి మీ ఆర్డర్‌ను చేయండి.",
    orderReview: "ఆర్డర్ సమీక్ష",
    completeSteps:
      "ఆర్డర్ చేయడానికి మీ డెలివరీ మరియు చెల్లింపు దశలను పూర్తి చేయండి.",
  },
  hi: {
    title: "अपने ऑर्डर की समीक्षा करें",
    description: "ऑर्डर देने से पहले सभी विवरण जांचें।",
    ready: "ऑर्डर के लिए तैयार",
    terms: "नियम और शर्तें",
    termsText:
      "Place Order बटन पर क्लिक करके, आप पुष्टि करते हैं कि आपने हमारी उपयोग की शर्तें, बिक्री की शर्तें और रिटर्न नीति पढ़ ली हैं, समझ ली हैं और स्वीकार करते हैं। साथ ही आप Medusa Store की गोपनीयता नीति पढ़ने की पुष्टि करते हैं।",
    everythingGood: "क्या सब कुछ सही है?",
    placeOrderText: "चेकआउट जारी रखने के लिए अपना ऑर्डर दें।",
    orderReview: "ऑर्डर की समीक्षा",
    completeSteps:
      "ऑर्डर देने के लिए डिलीवरी और भुगतान के चरण पूरे करें।",
  },
}

const Review = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  const searchParams = useSearchParams()
  const locale = useLocale()
  const t =
    translations[locale as keyof typeof translations] ?? translations.en

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard = !!(
    (cart as unknown as Record<string, unknown>)?.gift_cards &&
    (
      (cart as unknown as Record<string, unknown>)
        ?.gift_cards as unknown[]
    )?.length > 0 &&
    cart?.total === 0
  )

  const previousStepsCompleted =
    cart.shipping_address &&
    (cart.shipping_methods?.length ?? 0) > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <section
      className={clx(
        "overflow-hidden rounded-2xl border bg-gradient-to-br from-white via-indigo-50/30 to-violet-50/50 shadow-sm transition-all",
        isOpen
          ? "border-violet-200 shadow-violet-100/60"
          : "border-slate-200 opacity-80"
      )}
    >
      <div
        className={clx(
          "flex items-center gap-3 border-b px-5 py-5 small:px-6",
          isOpen
            ? "border-violet-100 bg-gradient-to-r from-violet-50 via-indigo-50 to-sky-50"
            : "border-slate-100 bg-slate-50"
        )}
      >
        <div
          className={clx(
            "flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md",
            isOpen
              ? "bg-gradient-to-br from-violet-600 to-blue-600 shadow-indigo-200"
              : "bg-slate-400 shadow-slate-200"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 4H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2"
            />
            <rect x="8" y="2" width="8" height="4" rx="1" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8 13 2 2 5-5"
            />
          </svg>
        </div>

        <div className="flex-1">
          <Heading level="h2" className="text-xl font-bold text-slate-900">
            {t.title}
          </Heading>
          <Text className="mt-1 text-sm text-slate-500">
            {t.description}
          </Text>
        </div>

        {isOpen && previousStepsCompleted && (
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            {t.ready}
          </span>
        )}
      </div>

      <div className="p-5 small:p-6">
        {isOpen && previousStepsCompleted ? (
          <>
            <div className="rounded-xl border border-indigo-100 bg-white p-4 shadow-sm small:p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3 5 6v5c0 4.5 2.9 7.7 7 10 4.1-2.3 7-5.5 7-10V6l-7-3Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m9 12 2 2 4-4"
                    />
                  </svg>
                </span>
                <Text className="font-semibold text-slate-900">
                  {t.terms}
                </Text>
              </div>

              <Text className="text-sm leading-6 text-slate-600">
                {t.termsText}
              </Text>
            </div>

            <div className="mt-5 rounded-xl border border-violet-100 bg-gradient-to-r from-violet-50 to-blue-50 p-4 small:p-5">
              <div className="mb-4 flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m5 12 4 4L19 6"
                    />
                  </svg>
                </span>
                <div>
                  <Text className="font-semibold text-slate-900">
                    {t.everythingGood}
                  </Text>
                  <Text className="mt-1 text-sm text-slate-600">
                    {t.placeOrderText}
                  </Text>
                </div>
              </div>

              <div className="[&_button]:!w-full [&_button]:!rounded-xl [&_button]:!bg-gradient-to-r [&_button]:!from-violet-600 [&_button]:!to-blue-600 [&_button]:!font-semibold [&_button]:!text-white [&_button]:!shadow-lg [&_button]:!shadow-indigo-200/70 [&_button]:transition-all [&_button:hover]:!from-violet-700 [&_button:hover]:!to-blue-700">
                <PaymentButton
                  cart={cart}
                  data-testid="submit-order-button"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <rect x="4" y="10" width="16" height="11" rx="2" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10V7a4 4 0 0 1 8 0v3"
                />
              </svg>
            </span>
            <div>
              <Text className="font-semibold text-slate-700">
                {t.orderReview}
              </Text>
              <Text className="mt-1 text-sm text-slate-500">
                {t.completeSteps}
              </Text>
            </div>
          </div>
        )}
      </div>

      <div className="h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-400" />
    </section>
  )
}

export default Review
