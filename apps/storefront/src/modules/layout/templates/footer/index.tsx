import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getTranslations } from "next-intl/server"

export default async function Footer() {
  const t = await getTranslations("Footer")

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

  const categoryTranslations: Record<string, string> = {
    shirts: t("shirts"),
    shirt: t("shirts"),
    pants: t("pants"),
    trousers: t("pants"),
    shoes: t("shoes"),
    "t-shirts": t("tshirts"),
    tshirts: t("tshirts"),
    shorts: t("shorts"),
  }

  const collectionTranslations: Record<string, string> = {
    "best-price": t("bestPrice"),
    "new-arrival": t("newArrival"),
    "best-sellers-now": t("bestSellers"),
  }

  return (
    <footer className="theme-footer mt-0 w-full overflow-hidden text-sm">
      {/* Back to top */}
      <a
        href="#top"
        className="theme-footer-top flex min-h-12 items-center justify-center gap-2 px-3 py-4 text-center text-xs font-bold uppercase tracking-[.16em] transition sm:px-4 sm:py-5 sm:text-sm"
      >
        <span aria-hidden="true">↑</span>
        {t("backToTop")}
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
              {t("description")}
            </p>

            <LocalizedClientLink
              href="/store"
              className="theme-footer-button mt-6 inline-flex min-h-11 max-w-full items-center justify-center gap-3 px-5 py-3 text-sm font-bold transition hover:-translate-y-1 sm:mt-7 sm:px-6 sm:py-3.5"
            >
              {t("exploreStore")} <span>→</span>
            </LocalizedClientLink>
          </div>

          {/* EXPLORE */}
          <div className="min-w-0">
            <h3 className="theme-footer-heading mb-4 text-xs font-bold uppercase tracking-[.18em] sm:mb-6 sm:text-sm">
              {t("explore")}
            </h3>

            <ul className="theme-footer-links space-y-4 sm:space-y-5">
              <li>
                <LocalizedClientLink href="/">{t("home")}</LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/store">
                  {t("allProducts")}
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/collections">
                  {t("collections")}
                </LocalizedClientLink>
              </li>
              <li>
                <a
                  href="https://github.com/medusajs"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("github")}
                </a>
              </li>
            </ul>
          </div>

          {/* CATEGORIES */}
          <div className="min-w-0">
            <h3 className="theme-footer-heading mb-4 text-xs font-bold uppercase tracking-[.18em] sm:mb-6 sm:text-sm">
              {t("shopCategories")}
            </h3>

            {rootCategories.length > 0 ? (
              <ul className="theme-footer-links space-y-4 sm:space-y-5">
                {rootCategories.map((category) => {
                  const handle = category.handle.toLowerCase()
                  const translatedName =
                    categoryTranslations[handle] ?? category.name

                  return (
                    <li key={category.id} className="break-words">
                      <LocalizedClientLink
                        href={`/categories/${category.handle}`}
                      >
                        {translatedName}
                      </LocalizedClientLink>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="theme-footer-muted">{t("noCategories")}</p>
            )}
          </div>

          {/* HELP */}
          <div className="min-w-0">
            <h3 className="theme-footer-heading mb-4 text-xs font-bold uppercase tracking-[.18em] sm:mb-6 sm:text-sm">
              {t("helpDiscover")}
            </h3>

            <ul className="theme-footer-links space-y-4 sm:space-y-5">
              <li>
                <LocalizedClientLink href="/account">
                  {t("myAccount")}
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/account/orders">
                  {t("myOrders")}
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/cart">
                  {t("shoppingCart")}
                </LocalizedClientLink>
              </li>

              {collections?.slice(0, 3).map((collection) => {
                const handle = collection.handle.toLowerCase()
                const translatedTitle =
                  collectionTranslations[handle] ?? collection.title

                return (
                  <li key={collection.id} className="break-words">
                    <LocalizedClientLink
                      href={`/collections/${collection.handle}`}
                    >
                      {translatedTitle}
                    </LocalizedClientLink>
                  </li>
                )
              })}

              <li>
                <a
                  href="https://docs.medusajs.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("documentation")}
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
                {t("tagline")}
              </span>
            </p>

            <p className="theme-footer-muted text-xs leading-5">
              © {new Date().getFullYear()} Medusa Store. {t("copyright")}
            </p>
          </div>
        </div>
      </div>

      {/* POWERED BY */}
      <div className="theme-footer-powered px-3 py-4 text-center text-[11px] tracking-wider sm:px-4 sm:py-5 sm:text-xs">
        {t("poweredBy")}{" "}
        <span className="theme-footer-brand-name font-bold">Medusa</span>
      </div>
    </footer>
  )
}