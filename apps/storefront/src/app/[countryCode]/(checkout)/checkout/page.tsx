
import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Checkout",
}

export default async function Checkout() {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  return (
    <main className="min-h-screen bg-[#f8f7ff] text-gray-900">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-14">
        {/* Header */}
        <header className="mb-8 border-b border-violet-100 pb-7 sm:mb-10 sm:pb-9">
          <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span>Home</span>
            <span>/</span>
            <span>Cart</span>
            <span>/</span>
            <span className="font-semibold text-violet-700">
              Checkout
            </span>
          </div>

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-violet-700">
                <span className="h-2 w-2 rounded-full bg-violet-500" />
                Almost there
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl lg:text-5xl">
                Checkout
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                Enter your delivery details, choose your payment
                method, and review your order before completing
                your purchase.
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
                  Secure checkout
                </span>
                <span className="mt-0.5 block text-xs text-gray-500">
                  Your order details
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
                Delivery and payment
              </p>
              <h2 className="mt-2 text-xl font-extrabold text-gray-950 sm:text-2xl">
                Complete your order
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Fill in the required information below to continue.
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
                    Your purchase
                  </p>
                  <h2 className="mt-2 text-2xl font-extrabold">
                    Order Summary
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-violet-100">
                    Review the items and totals in your order.
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
                  Secure payment process
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
                Secure checkout
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Protected checkout flow
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
                Order review
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Review details before placing an order
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
                Simple experience
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Delivery and payment in one place
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
