
import { Heading, Text } from "@modules/common/components/ui"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"
import { ShoppingBag, ShieldCheck, Sparkles } from "@medusajs/icons"

const CheckoutSummary = ({ cart }: { cart: HttpTypes.StoreCart }) => {
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
                  Order Summary
                </Heading>
                <Text className="mt-1 text-sm text-indigo-100">
                  Review your shopping bag
                </Text>
              </div>
            </div>

            <div className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold text-white">
              Checkout
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-y-5 p-4 small:p-6">
          {/* Price summary */}
          <section className="rounded-xl border border-indigo-100 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-gradient-to-b from-violet-600 to-blue-500" />
              <Text className="font-semibold text-slate-800">
                Price Details
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
                Items in Your Cart
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
                  Have a promo code?
                </Text>
                <Text className="text-xs text-violet-700">
                  Apply an eligible discount to your order
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
                Secure Checkout
              </Text>
              <Text className="mt-1 text-xs leading-5 text-emerald-800">
                Review your order details before completing your purchase.
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
