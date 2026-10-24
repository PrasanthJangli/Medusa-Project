
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
      listRegions().then(
        (result: StoreRegion[]) => result
      ),
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
    <div className="sticky top-0 z-50 w-full">
      {/* ROW 1: Main header */}
      <header className="bg-[#131921] text-white shadow-md">
        <nav className="mx-auto flex min-h-[76px] w-full items-center gap-2 px-3 sm:gap-4 sm:px-5 lg:px-8">
          {/* Menu */}
          <div className="flex shrink-0 items-center rounded-md border border-transparent px-1 py-2 hover:border-white sm:px-2">
            <SideMenu
              regions={regions}
              locales={locales}
              currentLocale={currentLocale}
            />
          </div>

          {/* MEDUSA Logo */}
          <LocalizedClientLink
            href="/"
            className="flex shrink-0 items-center rounded-md border border-transparent px-1 py-2 hover:border-white sm:px-2"
            data-testid="nav-store-link"
          >
            <span className="text-xl font-extrabold tracking-tight sm:text-2xl">
              MEDUSA<span className="text-[#febd69]">.</span>
            </span>
            <span className="ml-1 mt-2 hidden text-xs text-gray-300 sm:inline">
              STORE
            </span>
          </LocalizedClientLink>

          {/* Delivery label */}
          <div className="hidden shrink-0 flex-col rounded-md border border-transparent px-2 py-2 hover:border-white lg:flex">
            <span className="text-xs text-gray-300">
              Deliver to
            </span>
            <span className="flex items-center gap-1 text-sm font-bold">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4 text-[#febd69]"
              >
                <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              Your location
            </span>
          </div>

          {/* Search */}
          <div className="min-w-0 flex-1">
            <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-lg bg-white [&_input]:text-gray-900">
              <Search />
            </div>
          </div>

          {/* Account */}
          <LocalizedClientLink
            href="/account"
            data-testid="nav-account-link"
            className="hidden shrink-0 flex-col justify-center rounded-md border border-transparent px-2 py-2 hover:border-white sm:flex"
          >
            <span className="text-xs text-gray-300">
              Hello, sign in
            </span>
            <span className="text-sm font-bold">
              Account
            </span>
          </LocalizedClientLink>

          {/* Orders */}
          <LocalizedClientLink
            href="/account/orders"
            className="hidden shrink-0 flex-col justify-center rounded-md border border-transparent px-2 py-2 hover:border-white lg:flex"
          >
            <span className="text-xs text-gray-300">
              Your
            </span>
            <span className="text-sm font-bold">
              Orders
            </span>
          </LocalizedClientLink>

          {/* Cart icon and existing cart functionality */}
          <div className="shrink-0 rounded-md border border-transparent px-1 py-2 hover:border-white sm:px-2">
            <Suspense
              fallback={
                <LocalizedClientLink
                  href="/cart"
                  data-testid="nav-cart-link"
                  aria-label="Shopping cart"
                  className="flex items-center gap-1 text-sm font-semibold"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-7 w-7"
                  >
                    <path d="M3 3h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6" />
                    <circle cx="10" cy="20" r="1" />
                    <circle cx="18" cy="20" r="1" />
                  </svg>
                  <span className="hidden sm:inline">Cart</span>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>

      {/* ROW 2: Products and categories */}
      <div className="border-b border-white/10 bg-[#232f3e] text-white">
        <nav
          aria-label="Product categories"
          className="mx-auto flex min-h-12 items-center gap-1 overflow-x-auto px-3 sm:px-5 lg:px-8"
        >
          {/* All Products */}
          <LocalizedClientLink
            href="/store"
            className="flex shrink-0 items-center gap-2 rounded-md border border-transparent px-3 py-2 text-sm font-bold hover:border-white"
          >
            <span aria-hidden="true">☰</span>
            All Products
          </LocalizedClientLink>

          {/* All Collections */}
          <LocalizedClientLink
            href="/collections"
            className="shrink-0 whitespace-nowrap rounded-md border border-transparent px-3 py-2 text-sm font-semibold hover:border-white"
          >
            All Collections
          </LocalizedClientLink>

          {/* Actual Medusa categories */}
          {categories.map((category: StoreProductCategory) => (
            <LocalizedClientLink
              key={category.id}
              href={`/categories/${category.handle}`}
              className="shrink-0 whitespace-nowrap rounded-md border border-transparent px-3 py-2 text-sm transition hover:border-white hover:text-[#febd69]"
            >
              {category.name}
            </LocalizedClientLink>
          ))}
        </nav>
      </div>

      {/* ROW 3: Quick links */}
      <div className="border-b border-gray-200 bg-white text-gray-800">
        <nav
          aria-label="Store shortcuts"
          className="mx-auto flex min-h-10 items-center gap-5 overflow-x-auto px-4 sm:gap-8 sm:px-6 lg:px-8"
        >
          <LocalizedClientLink
            href="/store"
            className="shrink-0 py-2 text-xs font-bold transition hover:text-[#7c3aed] sm:text-sm"
          >
            Explore Products
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/collections"
            className="shrink-0 py-2 text-xs font-medium transition hover:text-[#7c3aed] sm:text-sm"
          >
            Browse Collections
          </LocalizedClientLink>

          <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            Discover something new
          </span>
        </nav>
      </div>
    </div>
  )
}
