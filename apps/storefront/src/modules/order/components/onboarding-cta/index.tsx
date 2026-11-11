
"use client"

import { resetOnboardingState } from "@lib/data/onboarding"
import { Button, Container, Text } from "@modules/common/components/ui"
import { useLocale } from "next-intl"

const translations = {
  en: {
    success: "Your test order was successfully created! 🎉",
    description: "You can now complete setting up your store in the admin.",
    button: "Complete setup in admin",
  },
  te: {
    success: "మీ టెస్ట్ ఆర్డర్ విజయవంతంగా సృష్టించబడింది! 🎉",
    description: "ఇప్పుడు మీరు అడ్మిన్‌లో మీ స్టోర్ సెటప్‌ను పూర్తి చేయవచ్చు.",
    button: "అడ్మిన్‌లో సెటప్ పూర్తి చేయండి",
  },
  hi: {
    success: "आपका टेस्ट ऑर्डर सफलतापूर्वक बनाया गया है! 🎉",
    description: "अब आप एडमिन में अपने स्टोर का सेटअप पूरा कर सकते हैं।",
    button: "एडमिन में सेटअप पूरा करें",
  },
}

const OnboardingCta = ({ orderId }: { orderId: string }) => {
  const locale = useLocale()

  const normalizedLocale: "en" | "te" | "hi" =
    locale === "te" || locale === "hi" ? locale : "en"

  const t = translations[normalizedLocale]

  return (
    <Container className="max-w-4xl h-full bg-ui-bg-subtle w-full">
      <div className="flex flex-col gap-y-4 center p-4 md:items-center">
        <Text className="text-ui-fg-base text-xl">
          {t.success}
        </Text>

        <Text className="text-ui-fg-subtle text-small-regular">
          {t.description}
        </Text>

        <Button
          className="w-fit"
          size="large"
          onClick={() => resetOnboardingState(orderId)}
        >
          {t.button}
        </Button>
      </div>
    </Container>
  )
}

export default OnboardingCta
