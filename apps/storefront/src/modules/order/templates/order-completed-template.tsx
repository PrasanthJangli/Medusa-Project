
import { Heading } from "@modules/common/components/ui"
import { cookies as nextCookies } from "next/headers"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import OrderCelebration from "@modules/order/components/order-celebration"
import { HttpTypes } from "@medusajs/types"
import { getUiLocale } from "@lib/data/ui-locale-actions"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

const translations = {
  en: {
    confirmed: "Order confirmed",
    thankYou: "Thank you for your order!",
    success:
      "Your order was placed successfully. We appreciate your purchase and look forward to serving you again.",
    order: "Order",
    confirmationFor: "Confirmation details for",
    orderDetails: "Order details",
    confirmation: "Your order confirmation",
    orderSummary: "Order summary",
    productsPayment: "Your products and payment total",
    delivery: "Delivery information",
    shipping: "Your shipping details",
    payment: "Payment information",
    paymentDetails: "Your payment details",
    thankYouStore: "Thank you for choosing our store",
  },
  te: {
    confirmed: "ఆర్డర్ నిర్ధారించబడింది",
    thankYou: "మీ ఆర్డర్‌కు ధన్యవాదాలు!",
    success:
      "మీ ఆర్డర్ విజయవంతంగా నమోదు చేయబడింది. మా స్టోర్‌ను ఎంచుకున్నందుకు ధన్యవాదాలు. మళ్లీ మీకు సేవ చేయడానికి ఎదురుచూస్తున్నాము.",
    order: "ఆర్డర్",
    confirmationFor: "నిర్ధారణ వివరాలు:",
    orderDetails: "ఆర్డర్ వివరాలు",
    confirmation: "మీ ఆర్డర్ నిర్ధారణ",
    orderSummary: "ఆర్డర్ సారాంశం",
    productsPayment: "మీ ఉత్పత్తులు మరియు చెల్లింపు మొత్తం",
    delivery: "డెలివరీ సమాచారం",
    shipping: "మీ షిప్పింగ్ వివరాలు",
    payment: "చెల్లింపు సమాచారం",
    paymentDetails: "మీ చెల్లింపు వివరాలు",
    thankYouStore: "మా స్టోర్‌ను ఎంచుకున్నందుకు ధన్యవాదాలు",
  },
  hi: {
    confirmed: "ऑर्डर की पुष्टि हो गई",
    thankYou: "आपके ऑर्डर के लिए धन्यवाद!",
    success:
      "आपका ऑर्डर सफलतापूर्वक दर्ज हो गया है। हमारी दुकान चुनने के लिए धन्यवाद। हम फिर से आपकी सेवा करने के लिए उत्सुक हैं।",
    order: "ऑर्डर",
    confirmationFor: "पुष्टि विवरण:",
    orderDetails: "ऑर्डर का विवरण",
    confirmation: "आपके ऑर्डर की पुष्टि",
    orderSummary: "ऑर्डर का सारांश",
    productsPayment: "आपके उत्पाद और भुगतान की कुल राशि",
    delivery: "डिलीवरी की जानकारी",
    shipping: "आपकी शिपिंग जानकारी",
    payment: "भुगतान की जानकारी",
    paymentDetails: "आपके भुगतान का विवरण",
    thankYouStore: "हमारी दुकान चुनने के लिए धन्यवाद",
  },
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()

  const isOnboarding =
    cookies.get("_medusa_onboarding")?.value === "true"

  const locale = await getUiLocale()

  const normalizedLocale: "en" | "te" | "hi" =
    locale === "te" || locale === "hi" ? locale : "en"

  const t = translations[normalizedLocale]

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full min-w-0 overflow-x-clip bg-gradient-to-br from-violet-50 via-white to-indigo-100/70 py-5 sm:py-8 md:py-12">
      <OrderCelebration />

      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-violet-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-64 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl" />

      <div className="content-container relative mx-auto flex w-full min-w-0 max-w-4xl flex-col items-center gap-y-5 px-3 sm:gap-y-8 sm:px-4">
        {isOnboarding && <OnboardingCta orderId={order.id} />}

        <main
          className="w-full min-w-0 overflow-hidden rounded-2xl border border-white bg-white/95 shadow-xl shadow-indigo-200/50 backdrop-blur-xl sm:rounded-3xl sm:shadow-2xl"
          data-testid="order-complete-container"
        >
          {/* SUCCESS BANNER */}
          <header className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-indigo-600 to-blue-600 px-4 py-8 text-center text-white sm:px-8 sm:py-12 md:px-10">
            <div className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full border border-white/20" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full border border-white/20" />

            <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-200/60 bg-emerald-400/20 shadow-[0_0_45px_rgba(52,211,153,0.45)] sm:mb-6 sm:h-24 sm:w-24">
              <div className="absolute inset-0 animate-ping rounded-full border border-emerald-200/60" />
              <div className="absolute inset-2 rounded-full bg-emerald-300/10" />

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="relative h-10 w-10 text-emerald-200 sm:h-12 sm:w-12"
                aria-hidden="true"
              >
                <path
                  d="m5 12 4 4L19 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-100 sm:text-xs sm:tracking-[0.3em]">
              🎉 {t.confirmed} 🎉
            </p>

            <Heading
              level="h1"
              className="mb-3 text-2xl font-extrabold leading-tight tracking-tight text-white sm:mb-4 sm:text-4xl md:text-5xl"
            >
              {t.thankYou}
            </Heading>

            <p className="mx-auto max-w-xl text-xs leading-6 text-indigo-100 sm:text-sm sm:leading-7 md:text-base">
              {t.success}
            </p>

            <div className="mt-6 inline-flex max-w-full items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-2.5 shadow-lg backdrop-blur-md sm:mt-7 sm:gap-3 sm:px-5 sm:py-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-400/25 sm:h-8 sm:w-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4 text-emerald-200 sm:h-5 sm:w-5"
                  aria-hidden="true"
                >
                  <path
                    d="m5 12 4 4L19 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <span className="min-w-0 break-all text-xs font-bold text-white sm:text-sm">
                {t.order} #{order.display_id ?? order.id}
              </span>
            </div>

            {order.email && (
              <p className="mt-4 break-all px-2 text-[11px] text-indigo-100 sm:mt-5 sm:text-sm">
                {t.confirmationFor} {order.email}
              </p>
            )}
          </header>

          {/* ORDER CONTENT */}
          <div className="min-w-0 space-y-5 p-3 sm:space-y-8 sm:p-6 md:p-8">
            {/* ORDER DETAILS */}
            <section className="min-w-0 overflow-hidden rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50/60 p-3 sm:rounded-2xl sm:p-6">
              <div className="mb-4 flex min-w-0 items-center gap-3 sm:mb-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-sm sm:h-11 sm:w-11 sm:text-xl">
                  📋
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                    {t.orderDetails}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    {t.confirmation}
                  </p>
                </div>
              </div>

              <div className="min-w-0">
                <OrderDetails order={order} />
              </div>
            </section>

            {/* ITEMS AND TOTALS */}
            <section className="min-w-0">
              <div className="mb-4 flex min-w-0 items-center gap-3 sm:mb-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-lg text-white shadow-lg shadow-indigo-200 sm:h-11 sm:w-11 sm:text-xl">
                  🛍️
                </div>
                <div className="min-w-0">
                  <Heading
                    level="h2"
                    className="text-xl font-bold text-slate-900 sm:text-2xl"
                  >
                    {t.orderSummary}
                  </Heading>
                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    {t.productsPayment}
                  </p>
                </div>
              </div>

              <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-6">
                <div className="min-w-0">
                  <Items order={order} />
                </div>

                <div className="mt-5 min-w-0 border-t border-dashed border-slate-200 pt-4 sm:mt-6 sm:pt-5">
                  <CartTotals totals={order} />
                </div>
              </div>
            </section>

            {/* SHIPPING INFORMATION */}
            <section className="min-w-0 overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-indigo-50/70 p-3 sm:rounded-2xl sm:p-6">
              <div className="mb-4 flex min-w-0 items-center gap-3 sm:mb-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-sm sm:h-11 sm:w-11 sm:text-xl">
                  🚚
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                    {t.delivery}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    {t.shipping}
                  </p>
                </div>
              </div>

              <div className="min-w-0">
                <ShippingDetails order={order} />
              </div>
            </section>

            {/* PAYMENT INFORMATION */}
            <section className="min-w-0 overflow-hidden rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-teal-50/70 p-3 sm:rounded-2xl sm:p-6">
              <div className="mb-4 flex min-w-0 items-center gap-3 sm:mb-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-sm sm:h-11 sm:w-11 sm:text-xl">
                  💳
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                    {t.payment}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    {t.paymentDetails}
                  </p>
                </div>
              </div>

              <div className="min-w-0">
                <PaymentDetails order={order} />
              </div>
            </section>

            {/* HELP */}
            <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3 sm:rounded-2xl sm:p-6">
              <Help />
            </section>
          </div>
        </main>

        <p className="px-2 text-center text-xs font-medium text-slate-500 sm:text-sm">
          {t.thankYouStore} 💜
        </p>
      </div>
    </div>
  )
}
