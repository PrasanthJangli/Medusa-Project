
import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const [{ collections }, productCategories] = await Promise.all([
    listCollections({
      fields: "*products",
    }),
    listCategories().catch((error) => {
      console.error("Unable to load footer categories:", error)
      return []
    }),
  ])

  const rootCategories = (productCategories ?? [])
    .filter((category) => !category.parent_category)
    .slice(0, 6)

  return (
    <footer className="mt-16 w-full border-t border-violet-100 bg-white text-sm">
      {/* Back to top */}
      <a
        href="#top"
        className="flex items-center justify-center gap-2 bg-violet-50 px-4 py-4 font-semibold text-violet-700 transition hover:bg-violet-100"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            d="m6 14 6-6 6 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to top
      </a>

      {/* Main footer */}
      <div className="bg-[#17132b] text-white">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 px-5 py-12 sm:grid-cols-2 sm:px-8 md:grid-cols-4 md:gap-8 lg:px-12 lg:py-16">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <LocalizedClientLink
              href="/"
              className="inline-flex items-center gap-3"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-xl font-black text-white">
                M
              </span>
              <span className="text-2xl font-extrabold tracking-tight">
                MEDUSA<span className="text-violet-400">.</span>
              </span>
            </LocalizedClientLink>

            <p className="mt-5 max-w-xs text-sm leading-7 text-violet-100/70">
              Discover products you love with a simple and enjoyable
              online shopping experience.
            </p>

            <LocalizedClientLink
              href="/store"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-violet-500"
            >
              Explore Store
              <span aria-hidden="true">→</span>
            </LocalizedClientLink>
          </div>

          {/* About */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-white">
              Explore
            </h3>
            <ul className="space-y-4 text-violet-100/70">
              <li>
                <LocalizedClientLink
                  href="/"
                  className="transition hover:text-white"
                >
                  Home
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/store"
                  className="transition hover:text-white"
                >
                  All Products
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/collections"
                  className="transition hover:text-white"
                >
                  Collections
                </LocalizedClientLink>
              </li>
              <li>
                <a
                  href="https://github.com/medusajs"
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-white"
                >
                  Medusa on GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-white">
              Shop Categories
            </h3>
            {rootCategories.length > 0 ? (
              <ul className="space-y-4 text-violet-100/70">
                {rootCategories.map((category) => (
                  <li key={category.id}>
                    <LocalizedClientLink
                      href={`/categories/${category.handle}`}
                      className="transition hover:text-white"
                    >
                      {category.name}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-violet-100/70">
                No categories available.
              </p>
            )}
          </div>

          {/* Help and collections */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-white">
              Help & Discover
            </h3>
            <ul className="space-y-4 text-violet-100/70">
              <li>
                <LocalizedClientLink
                  href="/account"
                  className="transition hover:text-white"
                >
                  My Account
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/account/orders"
                  className="transition hover:text-white"
                >
                  My Orders
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/cart"
                  className="transition hover:text-white"
                >
                  Shopping Cart
                </LocalizedClientLink>
              </li>
              {collections?.slice(0, 3).map((collection) => (
                <li key={collection.id}>
                  <LocalizedClientLink
                    href={`/collections/${collection.handle}`}
                    className="transition hover:text-white"
                  >
                    {collection.title}
                  </LocalizedClientLink>
                </li>
              ))}
              <li>
                <a
                  href="https://docs.medusajs.com"
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-white"
                >
                  Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Brand promise */}
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-5 py-6 text-center sm:px-8 md:flex-row md:items-center md:justify-between md:text-left lg:px-12">
            <p className="text-sm font-semibold text-white">
              MEDUSA<span className="text-violet-400">.</span>
              <span className="ml-2 font-normal text-violet-100/60">
                Your destination for online shopping
              </span>
            </p>
            <p className="text-xs text-violet-100/60">
              © {new Date().getFullYear()} Medusa Store. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="bg-[#100d20] px-4 py-3 text-center text-xs text-violet-100/60">
        Powered by Medusa
      </div>
    </footer>
  )
}
