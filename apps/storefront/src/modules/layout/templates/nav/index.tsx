
import { Suspense } from "react"

import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { listCategories } from "@lib/data/categories"

import type {
  StoreProductCategory,
  StoreRegion,
} from "@medusajs/types"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import Search from "@modules/layout/components/search"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale, categories] =
    await Promise.all([
      listRegions().then((result: StoreRegion[]) => result),
      listLocales(),
      getLocale(),
      listCategories({
        limit: 20,
        fields: "id,name,handle",
      }).catch((error) => {
        console.error("Unable to load categories:", error)
        return [] as StoreProductCategory[]
      }),
    ])

  return (
    <div className="theme-navbar sticky top-0 z-50 w-full min-w-0 overflow-x-clip shadow-lg">
      {/* ROW 1: MAIN NAVIGATION */}
      <header className="theme-nav-primary">
        <nav
          aria-label="Main navigation"
          className="theme-nav-primary-inner mx-auto flex w-full max-w-[1600px] min-w-0 flex-wrap items-center gap-x-2 gap-y-2 px-3 py-2.5 sm:gap-x-5 sm:gap-y-3 sm:px-6 sm:py-4 lg:px-8 xl:flex-nowrap xl:gap-5 xl:px-10"
        >
          {/* MENU */}
          <div className="order-1 flex shrink-0 items-center rounded-lg border border-white/20 p-1.5 transition hover:border-white sm:p-2">
            <SideMenu
              regions={regions}
              locales={locales}
              currentLocale={currentLocale}
            />
          </div>

          {/* STORE LOGO */}
          <LocalizedClientLink
            href="/"
            className="order-2 flex min-w-0 shrink-0 flex-col rounded-lg px-1.5 py-1 sm:px-2"
            data-testid="nav-store-link"
            aria-label="Medusa Store home"
          >
            <span className="whitespace-nowrap text-base font-extrabold tracking-[.08em] sm:text-2xl sm:tracking-[.12em]">
              MEDUSA<span className="theme-nav-accent">.</span>
            </span>

            <span className="text-center text-[7px] font-semibold tracking-[.3em] text-white/65 sm:text-[9px]">
              STORE
            </span>
          </LocalizedClientLink>

          {/* DELIVERY LOCATION - DESKTOP */}
          <div className="hidden shrink-0 flex-col xl:flex">
            <span className="text-xs text-white/65">
              Deliver to
            </span>

            <span className="flex items-center gap-1 text-sm font-bold">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="theme-nav-accent h-4 w-4"
              >
                <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              Your location
            </span>
          </div>

          {/* SEARCH */}
          <div className="theme-nav-search order-4 w-full min-w-0 basis-full xl:order-3 xl:flex-1 xl:basis-auto">
            <div className="mx-auto w-full max-w-4xl min-w-0 overflow-hidden rounded-lg bg-white [&_input]:min-w-0 [&_input]:text-gray-900">
              <Search />
            </div>
          </div>

          {/* ACCOUNT - DESKTOP */}
          <LocalizedClientLink
            href="/account"
            data-testid="nav-account-link"
            className="hidden shrink-0 flex-col rounded-lg border border-transparent px-2 py-2 transition hover:border-white xl:order-4 xl:flex"
          >
            <span className="text-xs text-white/65">
              Hello, sign in
            </span>
            <span className="text-sm font-bold">
              Account
            </span>
          </LocalizedClientLink>

          {/* ORDERS - DESKTOP */}
          <LocalizedClientLink
            href="/account/orders"
            className="hidden shrink-0 flex-col rounded-lg border border-transparent px-2 py-2 transition hover:border-white xl:order-5 xl:flex"
          >
            <span className="text-xs text-white/65">
              Your
            </span>
            <span className="text-sm font-bold">
              Orders
            </span>
          </LocalizedClientLink>

          {/* CART */}
          <div className="order-3 ml-auto flex shrink-0 items-center rounded-lg border border-transparent p-1.5 transition hover:border-white sm:p-2 xl:order-6 xl:ml-0">
            <Suspense
              fallback={
                <LocalizedClientLink
                  href="/cart"
                  data-testid="nav-cart-link"
                  aria-label="Shopping cart"
                  className="flex min-h-9 items-center gap-2 text-sm font-bold"
                >
                  <span className="text-xl sm:text-2xl">🛒</span>
                  <span className="hidden sm:inline">Cart</span>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>

      {/* ROW 2: PRODUCT CATEGORIES */}
      <div className="theme-nav-secondary min-w-0">
        <nav
          aria-label="Product categories"
          className="mx-auto flex min-h-11 w-full max-w-[1600px] min-w-0 items-center gap-1 overflow-x-auto overscroll-x-contain whitespace-nowrap px-2 sm:min-h-12 sm:px-6 lg:px-10 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
        >
          <LocalizedClientLink
            href="/store"
            className="shrink-0 rounded-lg border border-transparent px-3 py-2 text-xs font-bold transition hover:border-white sm:px-4 sm:text-sm"
          >
            ☰ All Products
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/collections"
            className="shrink-0 rounded-lg border border-transparent px-3 py-2 text-xs font-semibold transition hover:border-white sm:px-4 sm:text-sm"
          >
            All Collections
          </LocalizedClientLink>

          {categories.map((category: StoreProductCategory) => (
            <LocalizedClientLink
              key={category.id}
              href={`/categories/${category.handle}`}
              className="shrink-0 rounded-lg border border-transparent px-3 py-2 text-xs transition hover:border-white sm:px-4 sm:text-sm"
            >
              {category.name}
            </LocalizedClientLink>
          ))}
        </nav>
      </div>

      {/* ROW 3: STORE SHORTCUTS */}
      <div className="theme-nav-tertiary min-w-0">
        <nav
          aria-label="Store shortcuts"
          className="mx-auto flex min-h-9 w-full max-w-[1600px] min-w-0 items-center gap-4 overflow-x-auto overscroll-x-contain whitespace-nowrap px-3 sm:min-h-11 sm:gap-9 sm:px-6 lg:px-10 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
        >
          <LocalizedClientLink
            href="/store"
            className="shrink-0 py-2 text-[11px] font-bold transition hover:opacity-70 sm:text-sm"
          >
            Explore Products
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/collections"
            className="shrink-0 py-2 text-[11px] font-medium transition hover:opacity-70 sm:text-sm"
          >
            Browse Collections
          </LocalizedClientLink>

          <span className="theme-nav-badge shrink-0 rounded-full px-3 py-1.5 text-[10px] font-bold sm:px-4 sm:text-xs">
            Discover something new
          </span>
        </nav>
      </div>
    </div>
  )
}
