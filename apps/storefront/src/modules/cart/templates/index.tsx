
import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const itemCount =
    cart?.items?.reduce(
      (total, item) => total + (item.quantity ?? 0),
      0
    ) ?? 0

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#f8f7ff] text-gray-900">
      <div
        className="mx-auto w-full max-w-[1500px] px-3 py-6 sm:px-6 sm:py-10 lg:px-10 lg:py-14"
        data-testid="cart-container"
      >
        {cart?.items?.length ? (
          <>
            {/* Cart heading */}
            <header className="mb-7 sm:mb-10">
              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-gray-500 sm:mb-5 sm:text-sm">
                <span>Home</span>
                <span>/</span>
                <span className="font-medium text-violet-700">
                  Shopping Cart
                </span>
              </div>

              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div className="min-w-0">
                  <div className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-violet-700 sm:text-xs">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-violet-500" />
                    Your shopping bag
                  </div>

                  <h1 className="flex flex-wrap items-center gap-2 text-3xl font-extrabold tracking-tight text-gray-950 sm:gap-3 sm:text-4xl lg:text-5xl">
                    Your Cart
                    <span className="inline-flex shrink-0 items-center rounded-full bg-violet-100 px-3 py-1 text-base font-bold text-violet-700 sm:text-lg">
                      {itemCount}
                    </span>
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                    Your favourites are waiting. Review your items
                    and continue when you are ready.
                  </p>
                </div>

                <div className="flex w-fit max-w-full items-center gap-3 rounded-2xl border border-violet-100 bg-white px-3 py-3 shadow-sm sm:px-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
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

                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-gray-900">
                      Secure shopping
                    </span>
                    <span className="mt-0.5 block text-xs text-gray-500">
                      Checkout with confidence
                    </span>
                  </span>
                </div>
              </div>
            </header>

            {/* Main cart layout */}
            <div className="grid min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_350px] lg:gap-7 xl:grid-cols-[minmax(0,1fr)_410px] xl:gap-8">
              {/* Cart items */}
              <section className="min-w-0 overflow-hidden rounded-2xl border border-violet-100/80 bg-white shadow-[0_8px_35px_rgba(76,29,149,0.05)] sm:rounded-3xl">
                <div className="flex flex-col justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:px-6 sm:py-6 lg:px-7">
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-gray-950 sm:text-xl">
                      Cart Items
                    </h2>
                    <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                      Review your products and selected quantities.
                    </p>
                  </div>

                  <span className="w-fit shrink-0 rounded-full bg-violet-50 px-3 py-1.5 text-[10px] font-semibold text-violet-700 sm:text-xs">
                    {itemCount} {itemCount === 1 ? "item" : "items"} selected
                  </span>
                </div>

                <div className="min-w-0 p-3 sm:p-5 lg:p-7">
                  {!customer && (
                    <div className="mb-5 min-w-0 rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-white p-3 sm:mb-6 sm:p-5">
                      <SignInPrompt />
                      <div className="my-4">
                        <Divider />
                      </div>
                    </div>
                  )}

                  <div className="min-w-0">
                    <ItemsTemplate cart={cart} />
                  </div>
                </div>

                <div className="border-t border-gray-100 bg-gray-50/70 px-4 py-4 sm:px-6 lg:px-7">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-500 sm:text-sm">
                    <span className="flex items-center gap-2">
                      <span className="text-emerald-600">✓</span>
                      Secure shopping
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-emerald-600">✓</span>
                      Easy order review
                    </span>
                  </div>
                </div>
              </section>

              {/* Order summary */}
              <aside className="min-w-0 w-full lg:sticky lg:top-8">
                {cart.region && (
                  <div className="min-w-0 overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-[0_12px_40px_rgba(76,29,149,0.08)] sm:rounded-3xl">
                    <div className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-violet-700 to-indigo-800 px-4 py-5 text-white sm:px-7 sm:py-7">
                      <div
                        aria-hidden="true"
                        className="absolute -right-8 -top-12 h-36 w-36 rounded-full bg-white/10"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute -bottom-14 right-16 h-28 w-28 rounded-full bg-white/5"
                      />

                      <div className="relative">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-200 sm:text-xs">
                          Almost yours
                        </p>
                        <h2 className="mt-2 text-xl font-extrabold tracking-tight sm:text-2xl">
                          Order Summary
                        </h2>
                        <p className="mt-2 text-xs leading-6 text-violet-100 sm:text-sm">
                          Check your order details before continuing.
                        </p>
                      </div>
                    </div>

                    <div className="min-w-0 p-4 sm:p-6 lg:p-7">
                      <Summary cart={cart} />
                    </div>

                    <div className="border-t border-gray-100 bg-gray-50/70 px-4 py-4 sm:px-7">
                      <div className="flex flex-wrap items-center justify-center gap-2 text-center text-xs text-gray-500">
                        <svg
                          className="h-4 w-4 shrink-0 text-emerald-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          aria-hidden="true"
                        >
                          <rect
                            x="3"
                            y="10"
                            width="18"
                            height="11"
                            rx="2"
                          />
                          <path
                            d="M7 10V7a5 5 0 0 1 10 0v3"
                            strokeLinecap="round"
                          />
                        </svg>
                        Your checkout is protected
                      </div>
                    </div>
                  </div>
                )}
              </aside>
            </div>

            {/* Trust section */}
            <section className="mt-7 grid grid-cols-1 gap-3 border-t border-violet-100 pt-6 sm:mt-8 sm:grid-cols-2 sm:gap-4 sm:pt-7 lg:grid-cols-3">
              <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 sm:p-4">
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
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900">
                    Secure payment
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Protected checkout process
                  </p>
                </div>
              </div>

              <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 sm:p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <path d="M3 7h11v10H3z" />
                    <path d="M14 10h4l3 3v4h-7z" />
                    <circle cx="7.5" cy="19" r="1.5" />
                    <circle cx="17.5" cy="19" r="1.5" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900">
                    Order updates
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Follow your order journey
                  </p>
                </div>
              </div>

              <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 sm:p-4 sm:col-span-2 lg:col-span-1">
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
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900">
                    Shopping made easy
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Everything in one place
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : (
          <div className="mx-auto w-full max-w-4xl">
            <div className="mb-6 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 sm:text-xs">
                YOUR SHOPPING BAG
              </p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
                Your Cart
              </h1>
              <p className="mt-3 text-sm text-gray-500 sm:text-base">
                Your next favourite find is just around the corner.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-violet-100 bg-white p-4 shadow-[0_8px_35px_rgba(76,29,149,0.05)] sm:rounded-3xl sm:p-10">
              <EmptyCartMessage />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default CartTemplate
