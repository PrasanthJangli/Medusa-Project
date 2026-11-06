"use client"

import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductReviewForm from "@modules/products/components/product-review-form"
import { useLocale } from "next-intl"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const translations = {
  en: {
    details: "Product details",
    about: "About this product",
    moreInfo: "More product information may be available in the product options below.",
    needDetails: "Need more details?",
    reviewOptions: "Review the product information and available options before adding it to your cart.",
    feedback: "Customer feedback",
    reviews: "Product reviews",
    shareFeedback: "Share your feedback about this product.",
  },
  te: {
    details: "ఉత్పత్తి వివరాలు",
    about: "ఈ ఉత్పత్తి గురించి",
    moreInfo: "క్రింద ఉన్న ఉత్పత్తి ఎంపికలలో మరిన్ని వివరాలు అందుబాటులో ఉండవచ్చు.",
    needDetails: "మరిన్ని వివరాలు కావాలా?",
    reviewOptions: "కార్ట్‌లో చేర్చే ముందు ఉత్పత్తి సమాచారం మరియు అందుబాటులో ఉన్న ఎంపికలను పరిశీలించండి.",
    feedback: "కస్టమర్ అభిప్రాయం",
    reviews: "ఉత్పత్తి సమీక్షలు",
    shareFeedback: "ఈ ఉత్పత్తి గురించి మీ అభిప్రాయాన్ని పంచుకోండి.",
  },
  hi: {
    details: "उत्पाद विवरण",
    about: "इस उत्पाद के बारे में",
    moreInfo: "नीचे दिए गए उत्पाद विकल्पों में अधिक जानकारी उपलब्ध हो सकती है।",
    needDetails: "क्या आपको और जानकारी चाहिए?",
    reviewOptions: "कार्ट में जोड़ने से पहले उत्पाद की जानकारी और उपलब्ध विकल्पों की समीक्षा करें।",
    feedback: "ग्राहक प्रतिक्रिया",
    reviews: "उत्पाद समीक्षाएँ",
    shareFeedback: "इस उत्पाद के बारे में अपनी प्रतिक्रिया साझा करें।",
  },
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const locale = useLocale()
  const t = translations[locale as keyof typeof translations] || translations.en

  return (
    <div id="product-info" className="w-full">
      <div className="mx-auto flex w-full flex-col gap-y-6 rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm sm:p-7 lg:p-8">
        {product.collection && (
          <div>
            <LocalizedClientLink
              href={`/collections/${product.collection.handle}`}
              className="inline-flex items-center gap-2 rounded-full border border-[#dbeafe] bg-[#eff6ff] px-3 py-1.5 text-xs font-semibold text-[#245b80] transition hover:bg-[#dbeafe]"
            >
              <span aria-hidden="true">←</span>
              {product.collection.title}
            </LocalizedClientLink>
          </div>
        )}

        <div className="space-y-3">
          <span className="inline-flex items-center rounded-full bg-[#ecfdf5] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#047857]">
            {t.details}
          </span>

          <Heading
            level="h2"
            className="text-2xl font-extrabold leading-tight tracking-tight text-[#172b4d] sm:text-3xl lg:text-4xl"
            data-testid="product-title"
          >
            {product.title}
          </Heading>

          <div className="h-1 w-14 rounded-full bg-[#176b87]" />
        </div>

        {product.description ? (
          <div className="rounded-xl bg-[#f8fafc] p-4 sm:p-5">
            <h3 className="mb-2 text-sm font-bold text-[#172b4d]">
              {t.about}
            </h3>

            <Text
              className="whitespace-pre-line text-sm leading-7 text-[#64748b] sm:text-base"
              data-testid="product-description"
            >
              {product.description}
            </Text>
          </div>
        ) : (
          <Text className="text-sm leading-6 text-[#64748b]">
            {t.moreInfo}
          </Text>
        )}

        <div className="flex items-start gap-3 rounded-xl border border-[#e2e8f0] p-4">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eff6ff] text-xl"
          >
            ℹ️
          </span>

          <div>
            <h3 className="text-sm font-semibold text-[#172b4d]">
              {t.needDetails}
            </h3>

            <p className="mt-1 text-xs leading-5 text-[#64748b]">
              {t.reviewOptions}
            </p>
          </div>
        </div>
      </div>

      <section className="mt-8 rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#176b87]">
            {t.feedback}
          </span>

          <Heading
            level="h3"
            className="mt-2 text-xl font-bold tracking-tight text-[#172b4d] sm:text-2xl"
          >
            {t.reviews}
          </Heading>

          <Text className="mt-2 text-sm leading-6 text-[#64748b]">
            {t.shareFeedback}
          </Text>
        </div>

        <ProductReviewForm productId={product.id} />
      </section>
    </div>
  )
}

export default ProductInfo