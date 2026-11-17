
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
    <div className="theme-navbar sticky top-0 z-50 w-full shadow-lg">
      {/* ROW 1 */}
      <header className="theme-nav-primary">
        <nav className="mx-auto flex min-h-[82px] w-full items-center gap-3 px-3 sm:gap-5 sm:px-6 lg:px-10">
          <div className="rounded-lg border border-white/20 px-2 py-2 transition hover:border-white">
            <SideMenu
              regions={regions}
              locales={locales}
              currentLocale={currentLocale}
            />
          </div>

          <LocalizedClientLink
            href="/"
            className="group flex shrink-0 flex-col rounded-lg px-2 py-1"
            data-testid="nav-store-link"
          >
            <span className="text-xl font-extrabold tracking-[.12em] sm:text-2xl">
              MEDUSA<span className="theme-nav-accent">.</span>
            </span>
            <span className="text-center text-[9px] font-semibold tracking-[.35em] text-white/65">
              STORE
            </span>
          </LocalizedClientLink>

          <div className="hidden shrink-0 flex-col lg:flex">
            <span className="text-xs text-white/65">Deliver to</span>
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

          <div className="min-w-0 flex-1">
            <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-lg bg-white [&_input]:text-gray-900">
              <Search />
            </div>
          </div>

          <LocalizedClientLink
            href="/account"
            data-testid="nav-account-link"
            className="hidden shrink-0 flex-col rounded-lg border border-transparent px-2 py-2 hover:border-white sm:flex"
          >
            <span className="text-xs text-white/65">Hello, sign in</span>
            <span className="text-sm font-bold">Account</span>
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/account/orders"
            className="hidden shrink-0 flex-col rounded-lg border border-transparent px-2 py-2 hover:border-white lg:flex"
          >
            <span className="text-xs text-white/65">Your</span>
            <span className="text-sm font-bold">Orders</span>
          </LocalizedClientLink>

          <div className="shrink-0 rounded-lg border border-transparent px-2 py-2 hover:border-white">
            <Suspense
              fallback={
                <LocalizedClientLink
                  href="/cart"
                  data-testid="nav-cart-link"
                  aria-label="Shopping cart"
                  className="flex items-center gap-2 text-sm font-bold"
                >
                  <span className="text-2xl">🛒</span>
                  <span className="hidden sm:inline">Cart</span>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>

      {/* ROW 2 */}
      <div className="theme-nav-secondary">
        <nav
          aria-label="Product categories"
          className="mx-auto flex min-h-12 items-center gap-1 overflow-x-auto px-3 sm:px-6 lg:px-10"
        >
          <LocalizedClientLink
            href="/store"
            className="shrink-0 rounded-lg border border-transparent px-4 py-2 text-sm font-bold transition hover:border-white"
          >
            ☰ All Products
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/collections"
            className="shrink-0 whitespace-nowrap rounded-lg border border-transparent px-4 py-2 text-sm font-semibold transition hover:border-white"
          >
            All Collections
          </LocalizedClientLink>

          {categories.map((category: StoreProductCategory) => (
            <LocalizedClientLink
              key={category.id}
              href={`/categories/${category.handle}`}
              className="shrink-0 whitespace-nowrap rounded-lg border border-transparent px-4 py-2 text-sm transition hover:border-white"
            >
              {category.name}
            </LocalizedClientLink>
          ))}
        </nav>
      </div>

      {/* ROW 3 */}
      <div className="theme-nav-tertiary">
        <nav
          aria-label="Store shortcuts"
          className="mx-auto flex min-h-11 items-center gap-6 overflow-x-auto px-4 sm:gap-9 sm:px-6 lg:px-10"
        >
          <LocalizedClientLink
            href="/store"
            className="shrink-0 py-2 text-xs font-bold transition sm:text-sm"
          >
            Explore Products
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/collections"
            className="shrink-0 py-2 text-xs font-medium transition sm:text-sm"
          >
            Browse Collections
          </LocalizedClientLink>

          <span className="theme-nav-badge shrink-0 rounded-full px-4 py-1.5 text-xs font-bold">
            Discover something new
          </span>
        </nav>
      </div>
    </div>
  )
}
