
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
    <footer className="theme-footer mt-0 w-full overflow-hidden text-sm">
      {/* Back to top */}
      <a
        href="#top"
        className="theme-footer-top flex min-h-12 items-center justify-center gap-2 px-3 py-4 text-center text-xs font-bold uppercase tracking-[.16em] transition sm:px-4 sm:py-5 sm:text-sm"
      >
        <span aria-hidden="true">↑</span>
        Back to top
      </a>

      <div className="theme-footer-main">
        <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 gap-9 px-4 py-10 min-[480px]:grid-cols-2 min-[480px]:gap-x-8 min-[480px]:gap-y-10 sm:px-6 sm:py-14 md:grid-cols-4 md:gap-8 lg:px-12 lg:py-20">
          {/* BRAND */}
          <div className="min-w-0 min-[480px]:col-span-2 md:col-span-1">
            <LocalizedClientLink
              href="/"
              className="inline-flex max-w-full items-center gap-3"
            >
              <span className="theme-footer-brand-mark flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl font-black shadow-lg sm:h-14 sm:w-14 sm:text-2xl">
                M
              </span>

              <span className="theme-footer-brand-name break-words text-xl font-extrabold tracking-[.12em] sm:text-2xl">
                MEDUSA<span className="theme-nav-accent">.</span>
              </span>
            </LocalizedClientLink>

            <p className="theme-footer-muted mt-5 max-w-xs text-sm leading-7 sm:mt-6 sm:leading-8">
              Discover products you love with a simple, beautiful and enjoyable
              online shopping experience.
            </p>

            <LocalizedClientLink
              href="/store"
              className="theme-footer-button mt-6 inline-flex min-h-11 max-w-full items-center justify-center gap-3 px-5 py-3 text-sm font-bold transition hover:-translate-y-1 sm:mt-7 sm:px-6 sm:py-3.5"
            >
              Explore Store <span>→</span>
            </LocalizedClientLink>
          </div>

          {/* EXPLORE */}
          <div className="min-w-0">
            <h3 className="theme-footer-heading mb-4 text-xs font-bold uppercase tracking-[.18em] sm:mb-6 sm:text-sm">
              Explore
            </h3>

            <ul className="theme-footer-links space-y-4 sm:space-y-5">
              <li>
                <LocalizedClientLink href="/">Home</LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/store">
                  All Products
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/collections">
                  Collections
                </LocalizedClientLink>
              </li>
              <li>
                <a
                  href="https://github.com/medusajs"
                  target="_blank"
                  rel="noreferrer"
                >
                  Medusa on GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* CATEGORIES */}
          <div className="min-w-0">
            <h3 className="theme-footer-heading mb-4 text-xs font-bold uppercase tracking-[.18em] sm:mb-6 sm:text-sm">
              Shop Categories
            </h3>

            {rootCategories.length > 0 ? (
              <ul className="theme-footer-links space-y-4 sm:space-y-5">
                {rootCategories.map((category) => (
                  <li key={category.id} className="break-words">
                    <LocalizedClientLink
                      href={`/categories/${category.handle}`}
                    >
                      {category.name}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="theme-footer-muted">
                No categories available.
              </p>
            )}
          </div>

          {/* HELP */}
          <div className="min-w-0">
            <h3 className="theme-footer-heading mb-4 text-xs font-bold uppercase tracking-[.18em] sm:mb-6 sm:text-sm">
              Help & Discover
            </h3>

            <ul className="theme-footer-links space-y-4 sm:space-y-5">
              <li>
                <LocalizedClientLink href="/account">
                  My Account
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/account/orders">
                  My Orders
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/cart">
                  Shopping Cart
                </LocalizedClientLink>
              </li>

              {collections?.slice(0, 3).map((collection) => (
                <li key={collection.id} className="break-words">
                  <LocalizedClientLink
                    href={`/collections/${collection.handle}`}
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
                >
                  Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="theme-footer-bottom">
          <div className="mx-auto flex w-full max-w-[1500px] flex-col items-center gap-3 px-4 py-6 text-center sm:px-6 sm:py-7 md:flex-row md:justify-between md:gap-4 md:text-left lg:px-12">
            <p className="theme-footer-heading flex flex-wrap items-center justify-center gap-1 text-sm font-semibold tracking-wider md:justify-start">
              MEDUSA<span className="theme-nav-accent">.</span>
              <span className="theme-footer-muted ml-1 font-normal tracking-normal">
                Your destination for online shopping
              </span>
            </p>

            <p className="theme-footer-muted text-xs leading-5">
              © {new Date().getFullYear()} Medusa Store. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* POWERED BY */}
      <div className="theme-footer-powered px-3 py-4 text-center text-[11px] tracking-wider sm:px-4 sm:py-5 sm:text-xs">
        Powered by{" "}
        <span className="theme-footer-brand-name font-bold">Medusa</span>
      </div>
    </footer>
  )
}
