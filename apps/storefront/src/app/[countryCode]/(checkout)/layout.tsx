
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import MedusaCTA from "@modules/layout/components/medusa-cta"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen w-full overflow-x-clip bg-gradient-to-br from-slate-50 via-white to-indigo-50/60">
      {/* Modern Checkout Navbar */}
      <header className="sticky top-0 z-40 border-b border-indigo-100/80 bg-white/90 shadow-sm backdrop-blur-xl">
        <nav className="content-container flex h-[76px] items-center justify-between gap-4">
          {/* Back to cart */}
          <LocalizedClientLink
            href="/cart"
            className="group flex flex-1 basis-0 items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-indigo-700"
            data-testid="back-to-cart-link"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 transition-all group-hover:border-indigo-200 group-hover:bg-indigo-100">
              <ChevronDown
                className="rotate-90 text-indigo-700"
                size={17}
              />
            </span>

            <span className="hidden small:block">
              Back to shopping cart
            </span>
            <span className="small:hidden">Back</span>
          </LocalizedClientLink>

          {/* Store branding */}
          <LocalizedClientLink
            href="/"
            className="group flex items-center justify-center gap-3"
            data-testid="store-link"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 text-lg font-bold text-white shadow-md shadow-indigo-200 transition-transform group-hover:scale-105">
              M
            </span>

            <span className="flex flex-col">
              <span className="text-sm font-extrabold uppercase tracking-[0.16em] text-slate-900 small:text-base">
                Medusa Store
              </span>
              <span className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-indigo-500 small:block">
                Your shopping experience
              </span>
            </span>
          </LocalizedClientLink>

          {/* Secure checkout label */}
          <div className="flex flex-1 basis-0 justify-end">
            <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
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
              <span className="hidden small:inline">Secure checkout</span>
              <span className="small:hidden">Secure</span>
            </div>
          </div>
        </nav>
      </header>

      {/* Checkout Content */}
      <main
        className="relative min-h-[70vh]"
        data-testid="checkout-container"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-64 bg-gradient-to-b from-indigo-100/40 via-blue-50/20 to-transparent" />

        <div className="relative z-10">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-10 border-t border-indigo-100 bg-white/80">
        <div className="content-container flex flex-col items-center justify-between gap-3 py-6 small:flex-row">
          <LocalizedClientLink
            href="/"
            className="text-xs font-semibold uppercase tracking-wider text-slate-500 transition-colors hover:text-indigo-600"
          >
            Medusa Store
          </LocalizedClientLink>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Thank you for shopping with us
          </div>

          <div className="text-xs text-slate-400">
            <MedusaCTA />
          </div>
        </div>
      </footer>
    </div>
  )
}
