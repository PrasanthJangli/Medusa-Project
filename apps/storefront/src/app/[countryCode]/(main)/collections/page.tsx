
import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getTranslations } from "next-intl/server"

import { getUiLocale } from "@lib/data/ui-locale-actions"
import { listCollections } from "@lib/data/collections"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Collections")

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  }
}

const collectionTitleTranslations: Record<
  string,
  Record<string, string>
> = {
  en: {
    "best-price": "Best Price",
    "new-arrival": "New Arrival",
    "best-sellers-now": "Best Sellers Now",
    "best-sellers": "Best Sellers Now",
    "best-seller": "Best Sellers Now",
    "best-seller-now": "Best Sellers Now",
    "best-shorts": "Best Shorts",
    "best-shorts-now": "Best Shorts",
    "best shorts": "Best Shorts",
  },
  te: {
    "best-price": "ఉత్తమ ధర",
    "new-arrival": "కొత్త రాక",
    "best-sellers-now": "అత్యధికంగా అమ్ముడవుతున్నవి",
    "best-sellers": "అత్యధికంగా అమ్ముడవుతున్నవి",
    "best-seller": "అత్యధికంగా అమ్ముడవుతున్నవి",
    "best-seller-now": "అత్యధికంగా అమ్ముడవుతున్నవి",
    "best-shorts": "ఉత్తమ షార్ట్స్",
    "best-shorts-now": "ఉత్తమ షార్ట్స్",
    "best shorts": "ఉత్తమ షార్ట్స్",
  },
  hi: {
    "best-price": "सबसे अच्छी कीमत",
    "new-arrival": "नए आगमन",
    "best-sellers-now": "सबसे ज्यादा बिकने वाले",
    "best-sellers": "सबसे ज्यादा बिकने वाले",
    "best-seller": "सबसे ज्यादा बिकने वाले",
    "best-seller-now": "सबसे ज्यादा बिकने वाले",
    "best-shorts": "बेहतरीन शॉर्ट्स",
    "best-shorts-now": "बेहतरीन शॉर्ट्स",
    "best shorts": "बेहतरीन शॉर्ट्स",
  },
}

const normalizeText = (value: string) =>
  value.toLowerCase().trim().replace(/[\s_]+/g, "-")

export default async function CollectionsPage() {
  const t = await getTranslations("Collections")
  const currentLocale = await getUiLocale()
  const locale = currentLocale.split("-")[0]

  const { collections } = await listCollections({
    fields: "*products",
  })

  const validCollections = collections ?? []

  const localeTranslations =
    collectionTitleTranslations[locale] ??
    collectionTitleTranslations.en

  const getCollectionTitle = (
    title: string,
    handle: string
  ) => {
    const normalizedHandle = normalizeText(handle)
    const normalizedTitle = normalizeText(title)

    return (
      localeTranslations[normalizedHandle] ??
      localeTranslations[normalizedTitle] ??
      title
    )
  }

  return (
    <main className="content-container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {t("title")}
        </h1>

        <p className="mt-2 text-gray-600">
          {t("description")}
        </p>
      </div>

      {validCollections.length === 0 ? (
        <div className="rounded-xl border border-gray-200 p-10 text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {t("noCollections")}
          </h2>

          <p className="mt-2 text-gray-500">
            {t("checkBackLater")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {validCollections.map((collection) => {
            const products = collection.products ?? []
            const productCount = products.length

            const imageUrl = products.find(
              (product) => product.thumbnail
            )?.thumbnail

            const translatedTitle = getCollectionTitle(
              collection.title,
              collection.handle
            )

            return (
              <Link
                key={collection.id}
                href={`/collections/${collection.handle}`}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gray-100">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={translatedTitle}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <span className="text-5xl">🛍️</span>
                      <span className="text-sm">
                        {t("productCollection")}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h2 className="text-xl font-semibold text-gray-900 transition group-hover:text-violet-700">
                    {translatedTitle}
                  </h2>

                  <div className="mt-3">
                    <span className="inline-flex items-center rounded-full bg-violet-100 px-3 py-1.5 text-sm font-semibold text-violet-700">
                      <span className="mr-2" aria-hidden="true">
                        🛍️
                      </span>

                      {productCount}{" "}
                      {productCount === 1
                        ? t("product")
                        : t("products")}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-gray-500">
                    {productCount > 0
                      ? productCount === 1
                        ? t("exploreOneProduct")
                        : t("exploreProducts", {
                            count: productCount,
                          })
                      : t("exploreCollection")}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-sm font-medium text-violet-700">
                      {t("exploreCollectionButton")}
                    </span>

                    <span
                      className="text-lg text-violet-700 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
