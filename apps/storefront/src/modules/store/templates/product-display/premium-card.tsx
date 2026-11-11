
import { getUiLocale } from "@lib/data/ui-locale-actions"
import { getProductPrice } from "@lib/util/get-product-price"
import {
  translateProductName,
  translateProductDescription,
} from "@lib/util/translate-product"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import PreviewPrice from "@modules/products/components/product-preview/price"

type PremiumCardProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}

const premiumCardTranslations = {
  en: {
    curatedCollection: "Curated collection",
    premiumSelection: "Premium Selection",
    featured: "Featured",
    view: "View",
    premiumPick: "Premium pick",
    exploreProduct: "Explore product",
    premium: "Premium",
    product: "Product",
    price: "Price",
    priceUnavailable: "Price unavailable",
    viewProduct: "View product",
    viewDetails: "View details and available options",
  },
  te: {
    curatedCollection: "ఎంపిక చేసిన కలెక్షన్",
    premiumSelection: "ప్రీమియం ఎంపిక",
    featured: "ప్రత్యేకమైనది",
    view: "చూడండి",
    premiumPick: "ప్రీమియం ఎంపిక",
    exploreProduct: "ఉత్పత్తిని చూడండి",
    premium: "ప్రీమియం",
    product: "ఉత్పత్తి",
    price: "ధర",
    priceUnavailable: "ధర అందుబాటులో లేదు",
    viewProduct: "ఉత్పత్తిని చూడండి",
    viewDetails: "వివరాలు మరియు అందుబాటులో ఉన్న ఎంపికలను చూడండి",
  },
  hi: {
    curatedCollection: "विशेष रूप से चुना गया संग्रह",
    premiumSelection: "प्रीमियम चयन",
    featured: "विशेष",
    view: "देखें",
    premiumPick: "प्रीमियम पसंद",
    exploreProduct: "उत्पाद देखें",
    premium: "प्रीमियम",
    product: "उत्पाद",
    price: "कीमत",
    priceUnavailable: "कीमत उपलब्ध नहीं है",
    viewProduct: "उत्पाद देखें",
    viewDetails: "विवरण और उपलब्ध विकल्प देखें",
  },
}

export default async function PremiumCard({
  product,
  region,
}: PremiumCardProps) {
  const locale = await getUiLocale()

  const t =
    premiumCardTranslations[
      locale as keyof typeof premiumCardTranslations
    ] ?? premiumCardTranslations.en

  // Translate product title
  const productName = translateProductName(product.title, locale)

  // Translate product description
  const productDescription = product.description
    ? translateProductDescription(
        product.title,
        product.description,
        locale
      )
    : null

  const { cheapestPrice } = getProductPrice({ product })

  return (
    <article
      data-testid="product-wrapper"
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl"
    >
      {/* Premium header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-800 via-purple-700 to-fuchsia-700 px-4 py-3.5 text-white">
        <div className="absolute -right-5 -top-8 h-24 w-24 rounded-full bg-white/10" />
        <div className="absolute -right-1 bottom-0 h-12 w-12 rounded-full bg-white/5" />

        <div className="relative flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-purple-200">
              {t.curatedCollection}
            </p>

            <h3 className="mt-1 text-sm font-bold sm:text-base">
              {t.premiumSelection}
            </h3>
          </div>

          <span className="shrink-0 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wide">
            {t.featured}
          </span>
        </div>
      </div>

      {/* Product image */}
      <LocalizedClientLink
        href={`/products/${product.handle}`}
        className="block"
        aria-label={`${t.view} ${productName}`}
      >
        <div className="relative overflow-hidden bg-[#f7f5f2] p-3 sm:p-4">
          <div className="absolute left-5 top-5 z-10 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-gray-800 shadow-sm">
            {t.premiumPick}
          </div>

          <div className="aspect-square overflow-hidden rounded-xl bg-white">
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              size="square"
              className="!h-full !w-full !rounded-xl !bg-white !p-0 !shadow-none transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>

          <div className="absolute bottom-5 right-5 rounded-full border border-gray-100 bg-white/95 px-3 py-1.5 text-[10px] font-semibold text-violet-800 shadow-sm">
            {t.exploreProduct}
          </div>
        </div>
      </LocalizedClientLink>

      {/* Product details */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="rounded-md bg-violet-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-violet-700">
            {t.premium}
          </span>

          <span className="text-[11px] text-gray-400">
            {t.product}
          </span>
        </div>

        <LocalizedClientLink
          href={`/products/${product.handle}`}
          className="block"
        >
          <h3
            data-testid="product-title"
            className="line-clamp-2 min-h-12 text-base font-bold leading-6 text-gray-900 transition-colors group-hover:text-violet-700 sm:text-lg"
          >
            {productName}
          </h3>
        </LocalizedClientLink>

        {product.subtitle && (
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-gray-500">
            {product.subtitle}
          </p>
        )}

        {productDescription && (
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500">
            {productDescription}
          </p>
        )}

        {/* Price from Medusa */}
        <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">
            {t.price}
          </p>

          <div className="mt-1 break-words text-lg font-bold text-gray-950">
            {cheapestPrice ? (
              <PreviewPrice price={cheapestPrice} />
            ) : (
              <span className="text-sm font-medium text-gray-500">
                {t.priceUnavailable}
              </span>
            )}
          </div>
        </div>

        {/* Product CTA */}
        <div className="mt-auto pt-4">
          <LocalizedClientLink
            href={`/products/${product.handle}`}
            className="flex w-full items-center justify-between gap-3 rounded-xl bg-gray-950 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-violet-700"
          >
            <span>{t.viewProduct}</span>

            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 transition-transform group-hover:translate-x-1">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </LocalizedClientLink>

          <p className="mt-3 text-center text-[10px] text-gray-400">
            {t.viewDetails}
          </p>
        </div>
      </div>
    </article>
  )
}
