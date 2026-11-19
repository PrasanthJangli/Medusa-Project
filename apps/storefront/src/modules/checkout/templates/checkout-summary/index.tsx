
import { Heading, Text } from "@modules/common/components/ui"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"
import { ShoppingBag, ShieldCheck, Sparkles } from "@medusajs/icons"
import { getUiLocale } from "@lib/data/ui-locale-actions"

const translations = {
  en: {
    orderSummary: "Order Summary",
    reviewBag: "Review your shopping bag",
    checkout: "Checkout",
    priceDetails: "Price Details",
    cartItems: "Items in Your Cart",
    promoCode: "Have a promo code?",
    applyDiscount: "Apply an eligible discount to your order",
    secureCheckout: "Secure Checkout",
    secureMessage:
      "Review your order details before completing your purchase.",
  },
  te: {
    orderSummary: "ఆర్డర్ సారాంశం",
    reviewBag: "మీ షాపింగ్ బ్యాగ్‌ను సమీక్షించండి",
    checkout: "చెకౌట్",
    priceDetails: "ధర వివరాలు",
    cartItems: "మీ కార్ట్‌లోని వస్తువులు",
    promoCode: "మీ దగ్గర ప్రమో కోడ్ ఉందా?",
    applyDiscount: "మీ ఆర్డర్‌కు వర్తించే డిస్కౌంట్‌ను ఉపయోగించండి",
    secureCheckout: "సురక్షితమైన చెకౌట్",
    secureMessage:
      "మీ కొనుగోలును పూర్తి చేయడానికి ముందు ఆర్డర్ వివరాలను సమీక్షించండి.",
  },
  hi: {
    orderSummary: "ऑर्डर सारांश",
    reviewBag: "अपने शॉपिंग बैग की समीक्षा करें",
    checkout: "चेकआउट",
    priceDetails: "मूल्य विवरण",
    cartItems: "आपके कार्ट में आइटम",
    promoCode: "क्या आपके पास प्रोमो कोड है?",
    applyDiscount: "अपने ऑर्डर पर लागू छूट का उपयोग करें",
    secureCheckout: "सुरक्षित चेकआउट",
    secureMessage:
      "अपनी खरीदारी पूरी करने से पहले ऑर्डर विवरण की समीक्षा करें।",
  },
}

const CheckoutSummary = async ({
  cart,
}: {
  cart: HttpTypes.StoreCart
}) => {
  const locale = await getUiLocale()
  const t =
    translations[locale as keyof typeof translations] ?? translations.en

  return (
    <div className="sticky top-6 flex flex-col gap-y-6 py-6 small:py-0">
      <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/70 to-sky-50 shadow-lg shadow-indigo-100/50">
        {/* Gradient header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 px-6 py-6 text-white">
          <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10" />
          <div className="absolute -bottom-12 right-20 h-28 w-28 rounded-full bg-cyan-300/10" />

          <div className="relative flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/15 shadow-inner">
                <ShoppingBag className="h-6 w-6" />
              </div>

              <div>
                <Heading
                  level="h2"
                  className="text-xl font-bold text-white"
                >
                  {t.orderSummary}
                </Heading>
                <Text className="mt-1 text-sm text-indigo-100">
                  {t.reviewBag}
                </Text>
              </div>
            </div>

            <div className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold text-white">
              {t.checkout}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-y-5 p-4 small:p-6">
          {/* Price summary */}
          <section className="rounded-xl border border-indigo-100 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-gradient-to-b from-violet-600 to-blue-500" />
              <Text className="font-semibold text-slate-800">
                {t.priceDetails}
              </Text>
            </div>

            <CartTotals totals={cart} />
          </section>

          {/* Products */}
          <section className="rounded-xl border border-sky-100 bg-gradient-to-br from-white to-sky-50/70 p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                <ShoppingBag className="h-4 w-4" />
              </span>
              <Text className="font-semibold text-slate-800">
                {t.cartItems}
              </Text>
            </div>

            <ItemsPreviewTemplate cart={cart} />
          </section>

          {/* Promotion code */}
          <section className="rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 to-fuchsia-50/60 p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <Text className="font-semibold text-violet-950">
                  {t.promoCode}
                </Text>
                <Text className="text-xs text-violet-700">
                  {t.applyDiscount}
                </Text>
              </div>
            </div>

            <DiscountCode cart={cart} />
          </section>

          {/* Secure checkout note */}
          <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/80 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <Text className="font-semibold text-emerald-900">
                {t.secureCheckout}
              </Text>
              <Text className="mt-1 text-xs leading-5 text-emerald-800">
                {t.secureMessage}
              </Text>
            </div>
          </div>
        </div>

        <Divider className="hidden" />
      </div>
    </div>
  )
}

export default CheckoutSummary
