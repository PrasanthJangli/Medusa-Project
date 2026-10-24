
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

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()

  const isOnboarding =
    cookies.get("_medusa_onboarding")?.value === "true"

  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-br from-violet-50 via-white to-indigo-100/70 py-8 small:py-12">
      {/* Confetti celebration on successful order page mount */}
      <OrderCelebration />

      {/* Background glow */}
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-violet-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-64 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl" />

      <div className="content-container relative mx-auto flex w-full max-w-4xl flex-col items-center gap-y-8">
        {isOnboarding && <OnboardingCta orderId={order.id} />}

        <main
          className="w-full overflow-hidden rounded-3xl border border-white bg-white/95 shadow-2xl shadow-indigo-200/50 backdrop-blur-xl"
          data-testid="order-complete-container"
        >
          {/* Success banner */}
          <header className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-indigo-600 to-blue-600 px-5 py-12 text-center text-white small:px-10">
            <div className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full border border-white/20" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full border border-white/20" />

            {/* Animated success icon */}
            <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-emerald-200/60 bg-emerald-400/20 shadow-[0_0_45px_rgba(52,211,153,0.45)]">
              <div className="absolute inset-0 animate-ping rounded-full border border-emerald-200/60" />
              <div className="absolute inset-2 rounded-full bg-emerald-300/10" />

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="relative h-12 w-12 text-emerald-200"
                aria-hidden="true"
              >
                <path
                  d="m5 12 4 4L19 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-indigo-100">
              🎉 Order confirmed 🎉
            </p>

            <Heading
              level="h1"
              className="mb-4 text-3xl font-extrabold tracking-tight text-white small:text-5xl"
            >
              Thank you for your order!
            </Heading>

            <p className="mx-auto max-w-xl text-sm leading-7 text-indigo-100 small:text-base">
              Your order was placed successfully. We appreciate your
              purchase and look forward to serving you again.
            </p>

            <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/15 px-5 py-3 shadow-lg backdrop-blur-md">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/25">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5 text-emerald-200"
                  aria-hidden="true"
                >
                  <path
                    d="m5 12 4 4L19 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <span className="text-sm font-bold text-white">
                Order #{order.display_id ?? order.id}
              </span>
            </div>

            {order.email && (
              <p className="mt-5 break-all text-xs text-indigo-100 small:text-sm">
                Confirmation details for {order.email}
              </p>
            )}
          </header>

          <div className="space-y-8 p-4 small:p-8">
            {/* Order details */}
            <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50/60 p-4 small:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                  📋
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Order details
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Your order confirmation
                  </p>
                </div>
              </div>

              <OrderDetails order={order} />
            </section>

            {/* Items and totals */}
            <section>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-xl text-white shadow-lg shadow-indigo-200">
                  🛍️
                </div>
                <div>
                  <Heading
                    level="h2"
                    className="text-2xl font-bold text-slate-900"
                  >
                    Order summary
                  </Heading>
                  <p className="mt-1 text-sm text-slate-500">
                    Your products and payment total
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm small:p-6">
                <Items order={order} />

                <div className="mt-6 border-t border-dashed border-slate-200 pt-5">
                  <CartTotals totals={order} />
                </div>
              </div>
            </section>

            {/* Shipping information */}
            <section className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-indigo-50/70 p-4 small:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                  🚚
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Delivery information
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Your shipping details
                  </p>
                </div>
              </div>

              <ShippingDetails order={order} />
            </section>

            {/* Payment information */}
            <section className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-teal-50/70 p-4 small:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                  💳
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Payment information
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Your payment details
                  </p>
                </div>
              </div>

              <PaymentDetails order={order} />
            </section>

            {/* Help */}
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 small:p-6">
              <Help />
            </section>
          </div>
        </main>

        <p className="text-center text-sm font-medium text-slate-500">
          Thank you for choosing our store 💜
        </p>
      </div>
    </div>
  )
}
