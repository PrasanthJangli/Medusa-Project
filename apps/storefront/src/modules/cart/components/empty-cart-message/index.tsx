"use client"

import { Heading, Text } from "@modules/common/components/ui"
import { useLocale } from "next-intl"
import InteractiveLink from "@modules/common/components/interactive-link"

const translations = {
  en: {
    cart: "Cart",
    message:
      "You don't have anything in your cart. Let's change that, use the link below to start browsing our products.",
    explore: "Explore products",
  },
  te: {
    cart: "కార్ట్",
    message:
      "మీ కార్ట్‌లో ఇంకా ఏ ఉత్పత్తులు లేవు. మా ఉత్పత్తులను చూడటానికి క్రింది లింక్‌ను ఉపయోగించండి.",
    explore: "ఉత్పత్తులను చూడండి",
  },
  hi: {
    cart: "कार्ट",
    message:
      "आपके कार्ट में अभी कोई उत्पाद नहीं है। हमारे उत्पाद देखने के लिए नीचे दिए गए लिंक का उपयोग करें।",
    explore: "उत्पाद देखें",
  },
}

const EmptyCartMessage = () => {
  const locale = useLocale()
  const t =
    translations[locale as keyof typeof translations] ?? translations.en

  return (
    <div
      className="flex flex-col items-start justify-center px-2 py-48"
      data-testid="empty-cart-message"
    >
      <Heading
        level="h1"
        className="flex flex-row items-baseline gap-x-2 text-3xl-regular"
      >
        {t.cart}
      </Heading>

      <Text className="mb-6 mt-4 max-w-[32rem] text-base-regular">
        {t.message}
      </Text>

      <div>
        <InteractiveLink href="/store">{t.explore}</InteractiveLink>
      </div>
    </div>
  )
}

export default EmptyCartMessage