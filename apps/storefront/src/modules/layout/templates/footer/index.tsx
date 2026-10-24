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
    <footer className="mt-16 w-full border-t border-violet-100 bg-white text-sm text-slate-700">
      {/* Back to top */}
      <a
        href="#top"
        className="flex items-center justify-center gap-2 border-b border-violet-100 bg-violet-50 px-4 py-4 font-semibold text-violet-700 transition-colors hover:bg-violet-100"
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
      <div className="bg-white">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 px-5 py-12 sm:grid-cols-2 sm:px-8 md:grid-cols-4 md:gap-8 lg:px-12 lg:py-16">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <LocalizedClientLink
              href="/"
              className="inline-flex items-center gap-3"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-xl font-black text-white shadow-md shadow-violet-200">
                M
              </span>

              <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                MEDUSA<span className="text-violet-600">.</span>
              </span>
            </LocalizedClientLink>

            <p className="mt-5 max-w-xs text-sm leading-7 text-slate-600">
              Discover products you love with a simple and enjoyable
              online shopping experience.
            </p>

            <LocalizedClientLink
              href="/store"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-violet-700 hover:shadow-md"
            >
              Explore Store
              <span aria-hidden="true">→</span>
            </LocalizedClientLink>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-slate-900">
              Explore
            </h3>

            <ul className="space-y-4 text-slate-600">
              <li>
                <LocalizedClientLink
                  href="/"
                  className="transition-colors hover:text-violet-700"
                >
                  Home
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/store"
                  className="transition-colors hover:text-violet-700"
                >
                  All Products
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/collections"
                  className="transition-colors hover:text-violet-700"
                >
                  Collections
                </LocalizedClientLink>
              </li>
              <li>
                <a
                  href="https://github.com/medusajs"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-violet-700"
                >
                  Medusa on GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-slate-900">
              Shop Categories
            </h3>

            {rootCategories.length > 0 ? (
              <ul className="space-y-4 text-slate-600">
                {rootCategories.map((category) => (
                  <li key={category.id}>
                    <LocalizedClientLink
                      href={`/categories/${category.handle}`}
                      className="transition-colors hover:text-violet-700"
                    >
                      {category.name}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500">
                No categories available.
              </p>
            )}
          </div>

          {/* Help and collections */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-slate-900">
              Help &amp; Discover
            </h3>

            <ul className="space-y-4 text-slate-600">
              <li>
                <LocalizedClientLink
                  href="/account"
                  className="transition-colors hover:text-violet-700"
                >
                  My Account
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/account/orders"
                  className="transition-colors hover:text-violet-700"
                >
                  My Orders
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/cart"
                  className="transition-colors hover:text-violet-700"
                >
                  Shopping Cart
                </LocalizedClientLink>
              </li>

              {collections?.slice(0, 3).map((collection) => (
                <li key={collection.id}>
                  <LocalizedClientLink
                    href={`/collections/${collection.handle}`}
                    className="transition-colors hover:text-violet-700"
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
                  className="transition-colors hover:text-violet-700"
                >
                  Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom information */}
        <div className="border-t border-violet-100 bg-violet-50/60">
          <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-5 py-6 text-center sm:px-8 md:flex-row md:items-center md:justify-between md:text-left lg:px-12">
            <p className="text-sm font-semibold text-slate-900">
              MEDUSA<span className="text-violet-600">.</span>
              <span className="ml-2 font-normal text-slate-500">
                Your destination for online shopping
              </span>
            </p>

            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} Medusa Store. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Powered by */}
      <div className="border-t border-violet-100 bg-white px-4 py-4 text-center text-xs text-slate-500">
        Powered by <span className="font-semibold text-violet-700">Medusa</span>
      </div>
    </footer>
  )
}