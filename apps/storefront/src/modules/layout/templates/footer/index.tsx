
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
    <footer className="theme-footer mt-0 w-full text-sm">
      <a
        href="#top"
        className="theme-footer-top flex items-center justify-center gap-2 px-4 py-5 text-sm font-bold uppercase tracking-[.16em] transition"
      >
        <span aria-hidden="true">↑</span>
        Back to top
      </a>

      <div className="theme-footer-main">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-12 px-6 py-14 sm:grid-cols-2 md:grid-cols-4 lg:px-12 lg:py-20">

          {/* BRAND */}
          <div className="sm:col-span-2 md:col-span-1">
            <LocalizedClientLink href="/" className="inline-flex items-center gap-3">
              <span className="theme-footer-brand-mark flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-black shadow-lg">
                M
              </span>
              <span className="theme-footer-brand-name text-2xl font-extrabold tracking-[.12em]">
                MEDUSA<span className="theme-nav-accent">.</span>
              </span>
            </LocalizedClientLink>

            <p className="theme-footer-muted mt-6 max-w-xs text-sm leading-8">
              Discover products you love with a simple, beautiful and enjoyable
              online shopping experience.
            </p>

            <LocalizedClientLink
              href="/store"
              className="theme-footer-button mt-7 inline-flex items-center gap-3 px-6 py-3.5 text-sm font-bold transition hover:-translate-y-1"
            >
              Explore Store <span>→</span>
            </LocalizedClientLink>
          </div>

          {/* EXPLORE */}
          <div>
            <h3 className="theme-footer-heading mb-6 text-sm font-bold uppercase tracking-[.18em]">
              Explore
            </h3>
            <ul className="theme-footer-links space-y-5">
              <li><LocalizedClientLink href="/">Home</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/store">All Products</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/collections">Collections</LocalizedClientLink></li>
              <li>
                <a href="https://github.com/medusajs" target="_blank" rel="noreferrer">
                  Medusa on GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* CATEGORIES */}
          <div>
            <h3 className="theme-footer-heading mb-6 text-sm font-bold uppercase tracking-[.18em]">
              Shop Categories
            </h3>
            {rootCategories.length > 0 ? (
              <ul className="theme-footer-links space-y-5">
                {rootCategories.map((category) => (
                  <li key={category.id}>
                    <LocalizedClientLink href={`/categories/${category.handle}`}>
                      {category.name}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="theme-footer-muted">No categories available.</p>
            )}
          </div>

          {/* HELP */}
          <div>
            <h3 className="theme-footer-heading mb-6 text-sm font-bold uppercase tracking-[.18em]">
              Help & Discover
            </h3>
            <ul className="theme-footer-links space-y-5">
              <li><LocalizedClientLink href="/account">My Account</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/account/orders">My Orders</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/cart">Shopping Cart</LocalizedClientLink></li>

              {collections?.slice(0, 3).map((collection) => (
                <li key={collection.id}>
                  <LocalizedClientLink href={`/collections/${collection.handle}`}>
                    {collection.title}
                  </LocalizedClientLink>
                </li>
              ))}

              <li>
                <a href="https://docs.medusajs.com" target="_blank" rel="noreferrer">
                  Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="theme-footer-bottom">
          <div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-6 py-7 text-center sm:px-8 md:flex-row md:items-center md:justify-between md:text-left lg:px-12">
            <p className="theme-footer-heading text-sm font-semibold tracking-wider">
              MEDUSA<span className="theme-nav-accent">.</span>
              <span className="theme-footer-muted ml-2 font-normal tracking-normal">
                Your destination for online shopping
              </span>
            </p>
            <p className="theme-footer-muted text-xs">
              © {new Date().getFullYear()} Medusa Store. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* POWERED BY */}
      <div className="theme-footer-powered px-4 py-5 text-center text-xs tracking-wider">
        Powered by <span className="theme-footer-brand-name font-bold">Medusa</span>
      </div>
    </footer>
  )
}
