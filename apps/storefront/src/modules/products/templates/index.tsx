import React, { Suspense } from "react"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import { getUiLocale } from "@lib/data/ui-locale-actions"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const translations = {
  en: {
    store: "Store",
    productDetails: "Product details",
    discover: "Discover something special",
    heading: "Find your next favourite.",
    intro: "Explore product images, details and available options before making your selection.",
    gallery: "Product gallery",
    closerLook: "Take a closer look",
    productImages: "Product images",
    exploreGallery: "Explore the gallery",
    viewImages: "View the available product images",
    findFit: "Find your fit",
    reviewOptions: "Review product options before purchase",
    information: "Product information",
    knowProduct: "Know your product",
    overview: "Product overview",
    pricing: "Details and pricing",
    selection: "Your selection",
    ready: "Ready to choose?",
    chooseVariant: "Select an available variant and review your options.",
    reviewBefore: "Review before adding to cart",
    checkOptions: "Check your selected options and product details before continuing.",
    moreDiscover: "More to discover",
    alsoLike: "You may also like",
    exploreMore: "Explore more products from our store.",
    discoverMore: "Discover more",
  },
  te: {
    store: "స్టోర్",
    productDetails: "ఉత్పత్తి వివరాలు",
    discover: "ప్రత్యేకమైనదాన్ని కనుగొనండి",
    heading: "మీకు నచ్చే తదుపరి ఉత్పత్తిని ఎంచుకోండి.",
    intro: "ఎంచుకునే ముందు ఉత్పత్తి చిత్రాలు, వివరాలు మరియు అందుబాటులో ఉన్న ఎంపికలను చూడండి.",
    gallery: "ఉత్పత్తి చిత్రాలు",
    closerLook: "దగ్గరగా పరిశీలించండి",
    productImages: "ఉత్పత్తి ఫోటోలు",
    exploreGallery: "చిత్రాలను చూడండి",
    viewImages: "అందుబాటులో ఉన్న ఉత్పత్తి చిత్రాలను చూడండి",
    findFit: "మీకు సరిపోయేదాన్ని ఎంచుకోండి",
    reviewOptions: "కొనుగోలు చేసే ముందు ఉత్పత్తి ఎంపికలను పరిశీలించండి",
    information: "ఉత్పత్తి సమాచారం",
    knowProduct: "మీ ఉత్పత్తి గురించి తెలుసుకోండి",
    overview: "ఉత్పత్తి అవలోకనం",
    pricing: "వివరాలు మరియు ధర",
    selection: "మీ ఎంపిక",
    ready: "ఎంచుకోవడానికి సిద్ధంగా ఉన్నారా?",
    chooseVariant: "అందుబాటులో ఉన్న వేరియంట్‌ను ఎంచుకుని, ఎంపికలను పరిశీలించండి.",
    reviewBefore: "కార్ట్‌లో చేర్చే ముందు పరిశీలించండి",
    checkOptions: "కొనసాగించే ముందు మీరు ఎంచుకున్న ఎంపికలు మరియు ఉత్పత్తి వివరాలను తనిఖీ చేయండి.",
    moreDiscover: "మరిన్ని ఉత్పత్తులను చూడండి",
    alsoLike: "మీకు ఇవి కూడా నచ్చవచ్చు",
    exploreMore: "మా స్టోర్‌లో మరిన్ని ఉత్పత్తులను చూడండి.",
    discoverMore: "మరిన్ని చూడండి",
  },
  hi: {
    store: "स्टोर",
    productDetails: "उत्पाद विवरण",
    discover: "कुछ खास खोजें",
    heading: "अपना अगला पसंदीदा उत्पाद खोजें।",
    intro: "चुनने से पहले उत्पाद की तस्वीरें, विवरण और उपलब्ध विकल्प देखें।",
    gallery: "उत्पाद गैलरी",
    closerLook: "करीब से देखें",
    productImages: "उत्पाद की तस्वीरें",
    exploreGallery: "गैलरी देखें",
    viewImages: "उपलब्ध उत्पाद की तस्वीरें देखें",
    findFit: "अपने लिए सही विकल्प चुनें",
    reviewOptions: "खरीदने से पहले उत्पाद के विकल्प देखें",
    information: "उत्पाद की जानकारी",
    knowProduct: "अपने उत्पाद के बारे में जानें",
    overview: "उत्पाद का अवलोकन",
    pricing: "विवरण और कीमत",
    selection: "आपका चयन",
    ready: "चुनने के लिए तैयार हैं?",
    chooseVariant: "उपलब्ध विकल्प चुनें और अपने विकल्पों की समीक्षा करें।",
    reviewBefore: "कार्ट में जोड़ने से पहले जाँचें",
    checkOptions: "आगे बढ़ने से पहले अपने चुने हुए विकल्पों और उत्पाद विवरण की जाँच करें।",
    moreDiscover: "और भी देखें",
    alsoLike: "आपको यह भी पसंद आ सकता है",
    exploreMore: "हमारे स्टोर के और उत्पाद देखें।",
    discoverMore: "और खोजें",
  },
}

const ProductTemplate: React.FC<ProductTemplateProps> = async ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product?.id) {
    return notFound()
  }

  const locale = await getUiLocale()
  const t = translations[locale as keyof typeof translations] || translations.en

  return (
    <main
      className="min-h-screen overflow-x-hidden bg-[#f8f7fc] text-slate-900"
      data-testid="product-container"
    >
      <section className="mx-auto w-full max-w-[1800px] px-4 pt-5 sm:px-6 lg:px-10 lg:pt-8">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 sm:text-sm">
          <span>{t.store}</span>
          <span aria-hidden="true">/</span>
          <span className="text-violet-700">{t.productDetails}</span>
        </div>

        <div className="mt-5 overflow-hidden rounded-3xl bg-gradient-to-r from-violet-950 via-violet-900 to-[#6741a5] px-5 py-7 text-white shadow-lg sm:px-8 sm:py-9 lg:px-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-200">
                {t.discover}
              </p>

              <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                {t.heading}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-violet-100/80 sm:text-base">
                {t.intro}
              </p>
            </div>

            <div className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-white/20 bg-white/10 text-4xl backdrop-blur sm:flex">
              ✨
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:gap-8">
          <div className="min-w-0">
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-3 shadow-sm sm:p-5 lg:p-7">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700">
                    {t.gallery}
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
                    {t.closerLook}
                  </h2>
                </div>

                <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
                  {t.productImages}
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl bg-[#f7f5fb] p-2 sm:p-3">
                <ImageGallery images={images} />
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                    🖼️
                  </span>

                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {t.exploreGallery}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {t.viewImages}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                    ✨
                  </span>

                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {t.findFit}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {t.reviewOptions}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7 lg:mt-7">
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700">
                  {t.information}
                </p>

                <h2 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                  {t.knowProduct}
                </h2>
              </div>

              <ProductTabs product={product} />
            </div>
          </div>

          <div className="min-w-0 space-y-5 xl:sticky xl:top-6">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-xl">
                  🛍️
                </span>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700">
                    {t.overview}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {t.pricing}
                  </p>
                </div>
              </div>

              <div className="min-w-0">
                <ProductInfo product={product} />
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-sm">
              <div className="bg-gradient-to-r from-violet-950 to-violet-800 px-5 py-5 text-white sm:px-7">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-200">
                  {t.selection}
                </p>

                <h2 className="mt-2 text-xl font-extrabold sm:text-2xl">
                  {t.ready}
                </h2>

                <p className="mt-2 text-sm leading-6 text-violet-100/80">
                  {t.chooseVariant}
                </p>
              </div>

              <div className="p-5 sm:p-7">
                <ProductOnboardingCta />

                <Suspense
                  fallback={
                    <ProductActions
                      disabled={true}
                      product={product}
                      region={region}
                    />
                  }
                >
                  <ProductActionsWrapper
                    id={product.id}
                    region={region}
                  />
                </Suspense>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-lg">
                      ✓
                    </span>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {t.reviewBefore}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {t.checkOptions}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="mx-auto my-5 w-full max-w-[1800px] px-4 pb-10 sm:px-6 sm:pb-14 lg:px-10"
        data-testid="related-products-container"
      >
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7 lg:p-9">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-700">
                {t.moreDiscover}
              </p>

              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {t.alsoLike}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                {t.exploreMore}
              </p>
            </div>

            <span className="inline-flex items-center gap-2 self-start rounded-full bg-violet-50 px-4 py-2 text-xs font-bold text-violet-700 sm:self-auto">
              {t.discoverMore}
              <span aria-hidden="true">→</span>
            </span>
          </div>

          <Suspense fallback={<SkeletonRelatedProducts />}>
            <RelatedProducts
              product={product}
              countryCode={countryCode}
            />
          </Suspense>
        </div>
      </section>
    </main>
  )
}

export default ProductTemplate