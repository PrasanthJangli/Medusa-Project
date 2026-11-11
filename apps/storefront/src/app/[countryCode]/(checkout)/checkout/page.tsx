
import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getUiLocale } from "@lib/data/ui-locale-actions"

export const metadata: Metadata = {
  title: "Checkout",
}

const translations = {
  en: {
    home: "Home",
    cart: "Cart",
    checkout: "Checkout",
    almostThere: "Almost there",
    description:
      "Enter your delivery details, choose your payment method, and review your order before completing your purchase.",
    secureCheckout: "Secure checkout",
    orderDetails: "Your order details",
    deliveryPayment: "Delivery and payment",
    completeOrder: "Complete your order",
    requiredInfo: "Fill in the required information below to continue.",
    yourPurchase: "Your purchase",
    orderSummary: "Order Summary",
    reviewItems: "Review the items and totals in your order.",
    securePayment: "Secure payment process",
    protectedFlow: "Protected checkout flow",
    orderReview: "Order review",
    reviewDetails: "Review details before placing an order",
    simpleExperience: "Simple experience",
    deliveryInOnePlace: "Delivery and payment in one place",
  },
  te: {
    home: "హోమ్",
    cart: "కార్ట్",
    checkout: "చెక్‌అవుట్",
    almostThere: "దాదాపు పూర్తయింది",
    description:
      "మీ డెలివరీ వివరాలను నమోదు చేసి, చెల్లింపు పద్ధతిని ఎంచుకుని, కొనుగోలును పూర్తి చేయడానికి ముందు మీ ఆర్డర్‌ను సమీక్షించండి.",
    secureCheckout: "సురక్షిత చెక్‌అవుట్",
    orderDetails: "మీ ఆర్డర్ వివరాలు",
    deliveryPayment: "డెలివరీ మరియు చెల్లింపు",
    completeOrder: "మీ ఆర్డర్‌ను పూర్తి చేయండి",
    requiredInfo: "కొనసాగించడానికి అవసరమైన వివరాలను క్రింద నమోదు చేయండి.",
    yourPurchase: "మీ కొనుగోలు",
    orderSummary: "ఆర్డర్ సారాంశం",
    reviewItems: "మీ ఆర్డర్‌లోని వస్తువులు మరియు మొత్తం ధరలను సమీక్షించండి.",
    securePayment: "సురక్షిత చెల్లింపు ప్రక్రియ",
    protectedFlow: "రక్షిత చెక్‌అవుట్ విధానం",
    orderReview: "ఆర్డర్ సమీక్ష",
    reviewDetails: "ఆర్డర్ చేసే ముందు వివరాలను సమీక్షించండి",
    simpleExperience: "సులభమైన అనుభవం",
    deliveryInOnePlace: "డెలివరీ మరియు చెల్లింపు ఒకే చోట",
  },
  hi: {
    home: "होम",
    cart: "कार्ट",
    checkout: "चेकआउट",
    almostThere: "बस पूरा होने वाला है",
    description:
      "अपनी डिलीवरी जानकारी दर्ज करें, भुगतान विधि चुनें और खरीदारी पूरी करने से पहले अपने ऑर्डर की समीक्षा करें।",
    secureCheckout: "सुरक्षित चेकआउट",
    orderDetails: "आपके ऑर्डर का विवरण",
    deliveryPayment: "डिलीवरी और भुगतान",
    completeOrder: "अपना ऑर्डर पूरा करें",
    requiredInfo: "जारी रखने के लिए नीचे आवश्यक जानकारी भरें।",
    yourPurchase: "आपकी खरीदारी",
    orderSummary: "ऑर्डर सारांश",
    reviewItems: "अपने ऑर्डर के आइटम और कुल राशि की समीक्षा करें।",
    securePayment: "सुरक्षित भुगतान प्रक्रिया",
    protectedFlow: "सुरक्षित चेकआउट प्रक्रिया",
    orderReview: "ऑर्डर की समीक्षा",
    reviewDetails: "ऑर्डर देने से पहले विवरण की समीक्षा करें",
    simpleExperience: "आसान अनुभव",
    deliveryInOnePlace: "डिलीवरी और भुगतान एक ही जगह",
  },
}

export default async function Checkout() {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()
  const locale = await getUiLocale()

  const t =
    translations[locale as keyof typeof translations] ?? translations.en

  return (
    <main className="min-h-screen bg-[#f8f7ff] text-gray-900">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-14">
        {/* Header */}
        <header className="mb-8 border-b border-violet-100 pb-7 sm:mb-10 sm:pb-9">
          <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span>{t.home}</span>
            <span>/</span>
            <span>{t.cart}</span>
            <span>/</span>
            <span className="font-semibold text-violet-700">
              {t.checkout}
            </span>
          </div>

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-violet-700">
                <span className="h-2 w-2 rounded-full bg-violet-500" />
                {t.almostThere}
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl lg:text-5xl">
                {t.checkout}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                {t.description}
              </p>
            </div>

            <div className="flex w-fit items-center gap-3 rounded-2xl border border-violet-100 bg-white px-4 py-3 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path
                    d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="m9 12 2 2 4-4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <span>
                <span className="block text-sm font-bold text-gray-900">
                  {t.secureCheckout}
                </span>
                <span className="mt-0.5 block text-xs text-gray-500">
                  {t.orderDetails}
                </span>
              </span>
            </div>
          </div>
        </header>

        {/* Checkout content */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
          {/* Checkout form */}
          <section className="min-w-0 overflow-hidden rounded-3xl border border-violet-100/80 bg-white p-4 shadow-[0_8px_35px_rgba(76,29,149,0.05)] sm:p-6 lg:p-8">
            <div className="mb-6 border-b border-gray-100 pb-5 sm:mb-8 sm:pb-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700">
                {t.deliveryPayment}
              </p>

              <h2 className="mt-2 text-xl font-extrabold text-gray-950 sm:text-2xl">
                {t.completeOrder}
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {t.requiredInfo}
              </p>
            </div>

            <PaymentWrapper cart={cart}>
              <CheckoutForm cart={cart} customer={customer} />
            </PaymentWrapper>
          </section>

          {/* Order summary */}
          <aside className="min-w-0 lg:sticky lg:top-8">
            <div className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-[0_12px_40px_rgba(76,29,149,0.08)]">
              <div className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-violet-700 to-indigo-800 px-5 py-6 text-white sm:px-6 sm:py-7">
                <div
                  aria-hidden="true"
                  className="absolute -right-8 -top-12 h-36 w-36 rounded-full bg-white/10"
                />

                <div className="relative">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-200">
                    {t.yourPurchase}
                  </p>

                  <h2 className="mt-2 text-2xl font-extrabold">
                    {t.orderSummary}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-violet-100">
                    {t.reviewItems}
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <CheckoutSummary cart={cart} />
              </div>

              <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-4 sm:px-6">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <svg
                    className="h-4 w-4 text-emerald-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <rect x="3" y="10" width="18" height="11" rx="2" />
                    <path
                      d="M7 10V7a5 5 0 0 1 10 0v3"
                      strokeLinecap="round"
                    />
                  </svg>

                  {t.securePayment}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Trust information */}
        <footer className="mt-8 grid grid-cols-1 gap-3 border-t border-violet-100 pt-7 sm:grid-cols-3 sm:gap-4">
          <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <rect x="3" y="10" width="18" height="11" rx="2" />
                <path d="M7 10V7a5 5 0 0 1 10 0v3" />
              </svg>
            </span>

            <div>
              <p className="text-sm font-bold text-gray-900">
                {t.secureCheckout}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {t.protectedFlow}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M12 8v4l3 2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            </span>

            <div>
              <p className="text-sm font-bold text-gray-900">
                {t.orderReview}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {t.reviewDetails}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M12 3 14.8 8.7 21 9.6 16.5 14l1.1 6.2L12 17.3 6.4 20.2 7.5 14 3 9.6l6.2-.9L12 3Z" />
              </svg>
            </span>

            <div>
              <p className="text-sm font-bold text-gray-900">
                {t.simpleExperience}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {t.deliveryInOnePlace}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
