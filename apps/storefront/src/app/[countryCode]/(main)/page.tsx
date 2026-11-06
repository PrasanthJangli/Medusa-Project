
import type { Metadata } from "next"

import { listCollections } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

import { getLocale, getTranslations } from "next-intl/server"

export const metadata: Metadata = {
  title: "MAISON MEDUSA | Discover Your Style",
  description:
    "Discover beautiful fashion, curated collections and everyday essentials at Maison Medusa.",
}

const categoryImages = [
  {
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85",
  },
  {
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85",
  },
  {
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=85",
  },
  {
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85",
  },
  {
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85",
  },
  {
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85",
  },
]

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params

  const locale = await getLocale()
  const t = await getTranslations("Home")

  const [region, collectionData] = await Promise.all([
    getRegion(countryCode),
    listCollections({ fields: "id, handle, title" }),
  ])

  if (!region) return null

  const collections = collectionData?.collections ?? []

  const {
    response: { products: fetchedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      limit: 8,
      fields:
        "*variants.calculated_price,+variants.prices,*variants.images,*variants.options,+variants.inventory_quantity",
    },
  })

  const products = fetchedProducts ?? []
  const featuredCollections = collections.slice(0, 6)

  const heroProduct = products[0]
  const secondProduct = products[1]
  const thirdProduct = products[2]

  const benefits = [
    {
      icon: "✦",
      title: t("benefit1Title"),
      description: t("benefit1Description"),
      number: "01",
    },
    {
      icon: "◇",
      title: t("benefit2Title"),
      description: t("benefit2Description"),
      number: "02",
    },
    {
      icon: "♡",
      title: t("benefit3Title"),
      description: t("benefit3Description"),
      number: "03",
    },
  ]

  // Theme customizer CSS variables
  const pageStyle = {
    backgroundColor: "var(--theme-background, #f7f3ea)",
    color: "var(--theme-text, #211d17)",
    fontFamily: "var(--theme-font-body, Inter, sans-serif)",
    minHeight: "100vh",
  } as const

  const sectionStyle = {
    backgroundColor: "var(--theme-background, #f7f3ea)",
    color: "var(--theme-text, #211d17)",
  } as const

  const headingStyle = {
    color: "var(--theme-text, #211d17)",
    fontFamily: "var(--theme-font-heading, Playfair Display, serif)",
  } as const

  const accentStyle = {
    color: "var(--theme-primary, #171717)",
  } as const

  const buttonStyle = {
    backgroundColor: "var(--theme-primary, #171717)",
    color: "var(--theme-button-text, #ffffff)",
    borderRadius: "var(--theme-button-radius, 8px)",
  } as const

  const secondaryButtonStyle = {
    borderColor: "var(--theme-primary, #171717)",
    color: "var(--theme-primary, #171717)",
    borderRadius: "var(--theme-button-radius, 8px)",
  } as const

  const cardStyle = {
    backgroundColor:
      "var(--theme-surface, var(--theme-background, #f7f3ea))",
    color: "var(--theme-text, #211d17)",
    borderColor:
      "color-mix(in srgb, var(--theme-text, #211d17) 14%, transparent)",
    borderRadius: "var(--theme-card-radius, 12px)",
  } as const

  const subtleBorderStyle = {
    borderColor:
      "color-mix(in srgb, var(--theme-text, #211d17) 18%, transparent)",
  } as const

  const secondaryAccentStyle = {
    color: "var(--theme-secondary, #d4af37)",
  } as const

  const imageBorderStyle = {
    borderColor: "var(--theme-background, #f7f3ea)",
  } as const

  return (
    <main
      className="storefront-home w-full min-w-0 overflow-x-clip"
      style={pageStyle}
    >
      {/* ANNOUNCEMENT BAR */}

      <div
        className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-3 py-3 text-center text-[9px] font-bold uppercase tracking-[0.15em] sm:gap-x-4 sm:px-4 sm:text-[11px] sm:tracking-[0.22em]"
        style={buttonStyle}
      >
        <span>{t("announcement1")}</span>
        <span style={secondaryAccentStyle}>✦</span>
        <span>{t("announcement2")}</span>
      </div>

      {/* HERO SECTION */}

      <section
        className="relative isolate w-full min-w-0 overflow-hidden"
        style={sectionStyle}
      >
        <div
          className="pointer-events-none absolute -left-32 -top-32 h-[300px] w-[300px] rounded-full opacity-10 blur-[90px] sm:h-[420px] sm:w-[420px]"
          style={{ backgroundColor: "var(--theme-primary, #171717)" }}
        />

        <div
          className="pointer-events-none absolute -right-20 bottom-0 h-[300px] w-[300px] rounded-full opacity-10 blur-[90px] sm:h-[420px] sm:w-[420px]"
          style={{ backgroundColor: "var(--theme-secondary, #d4af37)" }}
        />

        <div className="relative mx-auto grid w-full max-w-[1440px] min-w-0 items-center gap-10 px-4 py-12 sm:gap-12 sm:px-8 sm:py-16 md:py-20 lg:grid-cols-2 lg:gap-16 lg:px-14 lg:py-24">
          <div className="relative z-10 mx-auto w-full min-w-0 max-w-[650px] lg:mx-0">
            <div
              className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-2 text-[8px] font-bold uppercase tracking-[0.15em] shadow-sm backdrop-blur-md sm:mb-7 sm:gap-3 sm:px-5 sm:py-3 sm:text-[10px] sm:tracking-[0.2em]"
              style={{
                backgroundColor:
                  "var(--theme-surface, var(--theme-background, #f7f3ea))",
                borderColor: "var(--theme-primary, #171717)",
                color: "var(--theme-primary, #171717)",
              }}
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: "var(--theme-primary, #171717)" }}
              />
              {t("welcome")}
            </div>

            <h1
              className="text-[clamp(2.7rem,8.5vw,5.125rem)] font-medium leading-[1.06] tracking-[-0.045em] sm:text-6xl md:text-7xl lg:text-[82px]"
              style={headingStyle}
            >
              {t("heroTitle1")}
              <br />
              {t("heroTitle2")}
              <br />
              <span className="italic" style={accentStyle}>
                {t("heroTitle3")}
              </span>
            </h1>

            <p className="mt-6 max-w-[480px] text-sm leading-7 opacity-75 sm:mt-9 sm:text-base sm:leading-8">
              {t("heroDescription")}
            </p>

            <div className="mt-7 flex w-full flex-col gap-3 min-[480px]:flex-row min-[480px]:flex-wrap sm:mt-9 sm:gap-4">
              <LocalizedClientLink
                href="/store"
                className="group inline-flex min-h-[52px] w-full items-center justify-center gap-5 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.14em] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:opacity-90 min-[480px]:w-fit sm:min-h-[55px] sm:px-8"
                style={buttonStyle}
              >
                {t("exploreStore")}
                <span className="text-lg transition-transform group-hover:translate-x-2">
                  →
                </span>
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/collections"
                className="inline-flex min-h-[52px] w-full items-center justify-center border px-6 py-4 text-[10px] font-bold uppercase tracking-[0.14em] transition-all duration-300 hover:-translate-y-1 min-[480px]:w-fit sm:min-h-[55px] sm:px-8"
                style={{
                  ...secondaryButtonStyle,
                  backgroundColor: "var(--theme-background, #f7f3ea)",
                }}
              >
                {t("exploreCollections")}
              </LocalizedClientLink>
            </div>

            <div
              className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-5 border-t pt-6 sm:mt-12 sm:gap-x-7 sm:pt-7"
              style={subtleBorderStyle}
            >
              {[
                ["01", t("findStyle")],
                ["02", t("exploreLooks")],
                ["03", t("makeYours")],
              ].map(([number, label], index) => (
                <div key={number} className="flex items-center gap-4 sm:gap-7">
                  <div className="min-w-0">
                    <p
                      className="text-xl sm:text-2xl"
                      style={{
                        color:
                          index === 1
                            ? "var(--theme-secondary, #d4af37)"
                            : "var(--theme-primary, #171717)",
                        fontFamily:
                          "var(--theme-font-heading, Playfair Display, serif)",
                      }}
                    >
                      {number}
                    </p>

                    <p className="mt-1 text-[7px] font-bold uppercase tracking-[0.12em] opacity-65 sm:text-[8px] sm:tracking-[0.16em]">
                      {label}
                    </p>
                  </div>

                  {index !== 2 && (
                    <div
                      className="h-8 w-px sm:h-10"
                      style={{
                        backgroundColor:
                          "color-mix(in srgb, var(--theme-text, #211d17) 18%, transparent)",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* HERO IMAGES */}

          <div className="relative mx-auto h-[350px] w-full min-w-0 max-w-[620px] sm:h-[500px] md:h-[540px] lg:h-[610px]">
            <div
              className="absolute left-[7%] top-[4%] h-[88%] w-[73%] overflow-hidden shadow-2xl"
              style={{
                backgroundColor: "var(--theme-secondary, #d4af37)",
                borderRadius: "48% 48% 12px 12px",
              }}
            >
              <img
                src={
                  heroProduct?.thumbnail ||
                  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1100&q=85"
                }
                alt={heroProduct?.title ?? "Maison Medusa fashion"}
                className="h-full w-full object-cover transition-transform duration-1000 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
            </div>

            <div
              className="absolute right-0 top-[9%] z-10 h-[34%] w-[35%] overflow-hidden border-[5px] shadow-2xl transition-transform duration-500 hover:-translate-y-2 sm:border-[7px]"
              style={{
                ...imageBorderStyle,
                borderRadius: "45% 45% 10px 10px",
              }}
            >
              <img
                src={
                  secondProduct?.thumbnail ||
                  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=85"
                }
                alt={secondProduct?.title ?? "Fashion accessories"}
                className="h-full w-full object-cover"
              />
            </div>

            <div
              className="absolute bottom-[4%] right-0 z-10 h-[32%] w-[38%] overflow-hidden border-[5px] shadow-2xl transition-transform duration-500 hover:translate-y-2 sm:border-[7px]"
              style={{
                ...imageBorderStyle,
                borderRadius: "10px 10px 45% 45%",
              }}
            >
              <img
                src={
                  thirdProduct?.thumbnail ||
                  "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=700&q=85"
                }
                alt={thirdProduct?.title ?? "Fashion footwear"}
                className="h-full w-full object-cover"
              />
            </div>

            <div
              className="absolute bottom-[16%] left-0 z-20 max-w-[65%] px-3 py-3 shadow-xl backdrop-blur-md transition-transform duration-500 hover:-translate-y-2 sm:max-w-none sm:px-7 sm:py-5"
              style={{
                ...cardStyle,
                backgroundColor: "var(--theme-background, #f7f3ea)",
              }}
            >
              <p className="text-base italic sm:text-2xl" style={headingStyle}>
                {t("wearStory")}
              </p>
              <p
                className="mt-1 text-[7px] font-bold uppercase tracking-[0.16em] sm:mt-2 sm:text-[8px] sm:tracking-[0.22em]"
                style={accentStyle}
              >
                Maison Medusa
              </p>
            </div>

            <div
              className="absolute right-[7%] top-[55%] z-20 flex h-[65px] w-[65px] rotate-12 flex-col items-center justify-center rounded-full text-center shadow-xl transition-transform duration-500 hover:rotate-0 sm:h-[92px] sm:w-[92px]"
              style={{
                backgroundColor: "var(--theme-secondary, #d4af37)",
                color: "var(--theme-button-text, #ffffff)",
              }}
            >
              <span className="text-xl sm:text-2xl">✦</span>
              <span className="text-[7px] font-bold uppercase tracking-wider sm:text-[8px]">
                {t("beYou")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTION SECTION */}

      <section
        className="w-full min-w-0 px-4 py-14 sm:px-8 sm:py-20 md:py-24 lg:px-12"
        style={sectionStyle}
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-9 flex min-w-0 flex-col justify-between gap-5 sm:mb-12 md:mb-14 md:flex-row md:items-end">
            <div className="min-w-0">
              <div
                className="mb-4 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.18em] sm:text-[10px] sm:tracking-[0.22em]"
                style={accentStyle}
              >
                <span
                  className="h-px w-9 shrink-0"
                  style={{ backgroundColor: "var(--theme-primary, #171717)" }}
                />
                {t("collectionEyebrow")}
              </div>

              <h2
                className="max-w-[700px] text-3xl font-medium leading-tight sm:text-5xl md:text-6xl"
                style={headingStyle}
              >
                {t("collectionHeading")}
              </h2>

              <p className="mt-4 max-w-[560px] text-sm leading-7 opacity-70 sm:mt-5">
                {t("collectionDescription")}
              </p>
            </div>

            <LocalizedClientLink
              href="/collections"
              className="group inline-flex w-fit max-w-full items-center gap-3 border-b pb-2 text-[9px] font-bold uppercase tracking-[0.12em] transition-opacity hover:opacity-70 sm:text-[10px] sm:tracking-[0.16em]"
              style={secondaryButtonStyle}
            >
              {t("viewCollections")}
              <span className="text-lg transition-transform group-hover:translate-x-2">
                →
              </span>
            </LocalizedClientLink>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {featuredCollections.length > 0 ? (
              featuredCollections.map((collection, index) => {
                const visual = categoryImages[index % categoryImages.length]

                return (
                  <LocalizedClientLink
                    key={collection.id}
                    href={`/collections/${collection.handle}`}
                    className="group block min-w-0"
                  >
                    <div
                      className="relative aspect-[4/4.7] overflow-hidden shadow-sm transition-shadow duration-500 group-hover:shadow-2xl"
                      style={{
                        borderRadius: "var(--theme-card-radius, 12px)",
                      }}
                    >
                      <img
                        src={visual.image}
                        alt={collection.title ?? "Maison Medusa collection"}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

                      <div
                        className="absolute left-4 top-4 rounded-full border border-white/50 px-3 py-2 text-[8px] font-bold tracking-[0.12em] text-white backdrop-blur-md sm:left-5 sm:top-5 sm:px-4 sm:text-[9px] sm:tracking-[0.16em]"
                        style={{
                          backgroundColor: "var(--theme-primary, #171717)",
                        }}
                      >
                        {String(index + 1).padStart(2, "0")} /{" "}
                        {t("collectionEyebrow")}
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-3 p-4 text-white sm:p-7">
                        <div className="min-w-0">
                          <h3
                            className="break-words text-xl font-medium sm:text-3xl"
                            style={{
                              fontFamily:
                                "var(--theme-font-heading, Playfair Display, serif)",
                            }}
                          >
                            {collection.title}
                          </h3>
                          <p className="mt-2 text-xs text-white/80">
                            {t("collectionDescription")}
                          </p>
                        </div>

                        <span
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/60 text-lg transition-all duration-300 group-hover:rotate-45 sm:h-11 sm:w-11 sm:text-xl"
                          style={{
                            backgroundColor: "var(--theme-primary, #171717)",
                          }}
                        >
                          ↗
                        </span>
                      </div>
                    </div>
                  </LocalizedClientLink>
                )
              })
            ) : (
              categoryImages.slice(0, 3).map((visual, index) => (
                <LocalizedClientLink
                  key={visual.image}
                  href="/store"
                  className="group block min-w-0"
                >
                  <div
                    className="relative aspect-[4/4.7] overflow-hidden"
                    style={{
                      borderRadius: "var(--theme-card-radius, 12px)",
                    }}
                  >
                    <img
                      src={visual.image}
                      alt="Maison Medusa collection"
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 p-5 text-white sm:p-7">
                      <h3
                        className="text-2xl sm:text-3xl"
                        style={{
                          fontFamily:
                            "var(--theme-font-heading, Playfair Display, serif)",
                        }}
                      >
                        {t("collectionHeading")}
                      </h3>
                      <p className="mt-2 text-xs text-white/80">
                        {t("collectionDescription")}
                      </p>
                    </div>
                  </div>
                </LocalizedClientLink>
              ))
            )}
          </div>
        </div>
      </section>

      {/* PRODUCT SECTION */}

      <section
        className="relative w-full min-w-0 overflow-hidden px-4 py-14 sm:px-8 sm:py-20 md:py-24 lg:px-12"
        style={sectionStyle}
      >
        <div
          className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full opacity-10 blur-[100px]"
          style={{ backgroundColor: "var(--theme-primary, #171717)" }}
        />

        <div className="relative mx-auto max-w-[1440px]">
          <div className="mb-9 flex min-w-0 flex-col justify-between gap-5 sm:mb-12 md:flex-row md:items-end">
            <div className="min-w-0">
              <div
                className="mb-4 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.18em] sm:text-[10px] sm:tracking-[0.22em]"
                style={accentStyle}
              >
                <span
                  className="h-px w-9 shrink-0"
                  style={{ backgroundColor: "var(--theme-primary, #171717)" }}
                />
                {t("productsEyebrow")}
              </div>

              <h2
                className="text-3xl font-medium leading-tight sm:text-5xl md:text-6xl"
                style={headingStyle}
              >
                {t("productsHeading")}
              </h2>

              <p className="mt-4 max-w-[560px] text-sm leading-7 opacity-70 sm:mt-5">
                {t("productsDescription")}
              </p>
            </div>

            <LocalizedClientLink
              href="/store"
              className="group inline-flex w-fit max-w-full items-center gap-3 border-b pb-2 text-[9px] font-bold uppercase tracking-[0.12em] sm:text-[10px] sm:tracking-[0.16em]"
              style={secondaryButtonStyle}
            >
              {t("shopProducts")}
              <span className="text-lg transition-transform group-hover:translate-x-2">
                →
              </span>
            </LocalizedClientLink>
          </div>

          {products.length > 0 ? (
            <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="group relative min-w-0 overflow-hidden border p-2 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                  style={cardStyle}
                >
                  {index === 0 && (
                    <span
                      className="absolute left-4 top-4 z-20 rounded-full px-3 py-2 text-[8px] font-bold uppercase tracking-[0.14em] shadow-md"
                      style={buttonStyle}
                    >
                      {t("featured")}
                    </span>
                  )}

                  <div
                    className="relative min-w-0 overflow-hidden"
                    style={{
                      borderRadius: "var(--theme-card-radius, 12px)",
                    }}
                  >
                    <ProductPreview
                      product={product}
                      region={region}
                      locale={locale}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="border px-5 py-14 text-center sm:px-6 sm:py-20"
              style={cardStyle}
            >
              <div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-3xl"
                style={{
                  backgroundColor: "var(--theme-secondary, #d4af37)",
                  color: "var(--theme-button-text, #ffffff)",
                }}
              >
                ✦
              </div>

              <h3 className="mt-6 text-2xl sm:text-3xl" style={headingStyle}>
                {t("noProducts")}
              </h3>

              <p className="mx-auto mt-4 max-w-[420px] text-sm leading-7 opacity-70">
                {t("noProductsDescription")}
              </p>

              <LocalizedClientLink
                href="/store"
                className="mt-7 inline-flex px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] sm:px-7"
                style={buttonStyle}
              >
                {t("exploreStore")} →
              </LocalizedClientLink>
            </div>
          )}
        </div>
      </section>

      {/* EDITORIAL BANNER */}

      <section
        className="w-full min-w-0 px-4 py-14 sm:px-8 sm:py-20 md:py-24 lg:px-12"
        style={sectionStyle}
      >
        <div
          className="mx-auto grid max-w-[1440px] min-w-0 overflow-hidden shadow-xl md:grid-cols-2"
          style={{
            ...sectionStyle,
            borderRadius: "var(--theme-card-radius, 12px)",
          }}
        >
          <div className="relative flex min-h-[360px] min-w-0 flex-col items-start justify-center overflow-hidden px-6 py-12 sm:min-h-[400px] sm:px-12 sm:py-14 md:px-14 lg:px-20">
            <div
              className="absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-10 blur-3xl"
              style={{ backgroundColor: "var(--theme-primary, #171717)" }}
            />

            <div className="relative min-w-0">
              <div
                className="mb-5 text-[9px] font-bold uppercase tracking-[0.18em] sm:mb-6 sm:text-[10px] sm:tracking-[0.22em]"
                style={accentStyle}
              >
                {t("editorialEyebrow")}
              </div>

              <h2
                className="max-w-[530px] text-3xl font-medium leading-tight sm:text-5xl md:text-6xl"
                style={headingStyle}
              >
                {t("editorialHeading1")}
                <br />
                <span className="italic" style={accentStyle}>
                  {t("editorialHeading2")}
                </span>
              </h2>

              <p className="mt-6 max-w-[430px] text-sm leading-7 opacity-75 sm:mt-7 sm:leading-8">
                {t("editorialDescription")}
              </p>

              <LocalizedClientLink
                href="/collections"
                className="group mt-8 inline-flex min-h-[50px] items-center gap-4 px-6 py-4 text-[9px] font-bold uppercase tracking-[0.13em] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:opacity-90 sm:mt-9 sm:gap-5 sm:px-8 sm:text-[10px] sm:tracking-[0.16em]"
                style={buttonStyle}
              >
                {t("discoverEdit")}
                <span className="text-lg transition-transform group-hover:translate-x-2">
                  →
                </span>
              </LocalizedClientLink>
            </div>
          </div>

          <div className="relative min-h-[300px] min-w-0 overflow-hidden sm:min-h-[420px] md:min-h-[580px]">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85"
              alt="Maison Medusa seasonal fashion inspiration"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

            <div
              className="absolute bottom-5 right-5 max-w-[80%] border px-4 py-4 shadow-xl backdrop-blur-md sm:bottom-7 sm:right-7 sm:px-6 sm:py-5"
              style={{
                ...cardStyle,
                backgroundColor: "var(--theme-background, #f7f3ea)",
              }}
            >
              <p className="text-lg italic sm:text-xl" style={headingStyle}>
                {t("styleWithSoul")}
              </p>
              <p
                className="mt-1 text-[7px] font-bold uppercase tracking-[0.16em] sm:text-[8px] sm:tracking-[0.2em]"
                style={accentStyle}
              >
                Maison Medusa
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BRAND STORY */}

      <section
        className="w-full min-w-0 px-4 py-14 sm:px-8 sm:py-20 md:py-24 lg:px-12"
        style={sectionStyle}
      >
        <div className="mx-auto grid max-w-[1250px] min-w-0 items-center gap-12 md:grid-cols-2 md:gap-20">
          <div className="relative mx-auto w-full min-w-0 max-w-[540px] px-2 pb-4">
            <div
              className="absolute -left-1 -top-3 h-20 w-20 rounded-tl-[35px] border-l-2 border-t-2 sm:-left-5 sm:-top-5 sm:h-28 sm:w-28 sm:rounded-tl-[50px]"
              style={{
                borderColor: "var(--theme-primary, #171717)",
              }}
            />

            <div
              className="absolute -bottom-1 -right-1 h-20 w-20 rounded-br-[35px] border-b-2 border-r-2 sm:-bottom-5 sm:-right-5 sm:h-28 sm:w-28 sm:rounded-br-[50px]"
              style={{
                borderColor: "var(--theme-secondary, #d4af37)",
              }}
            />

            <div
              className="relative aspect-[4/5] overflow-hidden shadow-xl"
              style={{
                borderRadius: "var(--theme-card-radius, 12px)",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85"
                alt="Fashion inspiration at Maison Medusa"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>

            <div
              className="absolute -bottom-1 right-0 max-w-[85%] px-4 py-4 shadow-xl sm:-bottom-2 sm:-right-7 sm:px-6 sm:py-5"
              style={buttonStyle}
            >
              <p
                className="text-xl italic sm:text-2xl"
                style={{
                  fontFamily:
                    "var(--theme-font-heading, Playfair Display, serif)",
                }}
              >
                {t("beOriginal")}
              </p>
              <p className="mt-1 text-[7px] font-semibold uppercase tracking-[0.16em] opacity-80 sm:text-[8px] sm:tracking-[0.2em]">
                {t("beUnmistakablyYou")}
              </p>
            </div>
          </div>

          <div className="min-w-0 pt-4 md:pt-0">
            <div
              className="mb-5 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.18em] sm:text-[10px] sm:tracking-[0.22em]"
              style={accentStyle}
            >
              <span
                className="h-px w-8 shrink-0"
                style={{ backgroundColor: "var(--theme-primary, #171717)" }}
              />
              {t("brandEyebrow")}
            </div>

            <h2
              className="text-3xl font-medium leading-tight sm:text-5xl md:text-6xl"
              style={headingStyle}
            >
              {t("brandHeading1")}
              <br />
              <span className="italic" style={accentStyle}>
                {t("brandHeading2")}
              </span>
            </h2>

            <p className="mt-6 text-sm leading-7 opacity-75 sm:mt-7 sm:leading-8">
              {t("brandDescription1")}
            </p>

            <p className="mt-4 text-sm leading-7 opacity-75 sm:mt-5 sm:leading-8">
              {t("brandDescription2")}
            </p>

            <LocalizedClientLink
              href="/collections"
              className="group mt-8 inline-flex items-center gap-4 border-b pb-2 text-[9px] font-bold uppercase tracking-[0.13em] sm:mt-9 sm:text-[10px] sm:tracking-[0.16em]"
              style={secondaryButtonStyle}
            >
              {t("exploreOurCollections")}
              <span className="text-lg transition-transform group-hover:translate-x-2">
                →
              </span>
            </LocalizedClientLink>
          </div>
        </div>
      </section>

      {/* BENEFITS */}

      <section
        className="w-full min-w-0 px-4 py-14 sm:px-8 sm:py-20 md:py-24 lg:px-12"
        style={sectionStyle}
      >
        <div className="mx-auto max-w-[1300px]">
          <div className="mb-10 text-center sm:mb-14">
            <div
              className="mb-4 text-[9px] font-bold uppercase tracking-[0.18em] sm:text-[10px] sm:tracking-[0.22em]"
              style={accentStyle}
            >
              {t("benefitsEyebrow")}
            </div>

            <h2
              className="text-3xl font-medium sm:text-5xl"
              style={headingStyle}
            >
              {t("benefitsHeading")}
            </h2>

            <p className="mx-auto mt-4 max-w-[550px] text-sm leading-7 opacity-70 sm:mt-5">
              {t("benefitsDescription")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.number}
                className="group relative min-w-0 overflow-hidden border px-5 py-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl sm:px-7 sm:py-10"
                style={cardStyle}
              >
                <span
                  className="absolute right-5 top-4 text-4xl opacity-20 sm:right-6 sm:top-5"
                  style={accentStyle}
                >
                  {benefit.number}
                </span>

                <div
                  className="mx-auto flex h-[65px] w-[65px] items-center justify-center rounded-2xl text-3xl transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 sm:h-[70px] sm:w-[70px]"
                  style={{
                    backgroundColor: "var(--theme-secondary, #d4af37)",
                    color: "var(--theme-button-text, #ffffff)",
                  }}
                >
                  {benefit.icon}
                </div>

                <h3
                  className="mt-6 text-xl font-medium sm:mt-7 sm:text-2xl"
                  style={headingStyle}
                >
                  {benefit.title}
                </h3>

                <p className="mx-auto mt-4 max-w-[300px] text-sm leading-7 opacity-70">
                  {benefit.description}
                </p>

                <div
                  className="mx-auto mt-7 h-[2px] w-10 rounded-full transition-all duration-300 group-hover:w-20"
                  style={{
                    backgroundColor: "var(--theme-primary, #171717)",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
