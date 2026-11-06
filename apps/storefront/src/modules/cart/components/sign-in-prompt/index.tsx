"use client"

import { Button, Heading, Text } from "@modules/common/components/ui"
import { useLocale } from "next-intl"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const translations = {
  en: {
    heading: "Already have an account?",
    description: "Sign in for a better experience.",
    signIn: "Sign in",
  },
  te: {
    heading: "మీకు ఇప్పటికే ఖాతా ఉందా?",
    description: "మెరుగైన అనుభవం కోసం సైన్ ఇన్ చేయండి.",
    signIn: "సైన్ ఇన్",
  },
  hi: {
    heading: "क्या आपका पहले से खाता है?",
    description: "बेहतर अनुभव के लिए साइन इन करें।",
    signIn: "साइन इन करें",
  },
}

const SignInPrompt = () => {
  const locale = useLocale()
  const t =
    translations[locale as keyof typeof translations] ?? translations.en

  return (
    <div className="flex items-center justify-between bg-white">
      <div>
        <Heading level="h2" className="txt-xlarge">
          {t.heading}
        </Heading>

        <Text className="mt-2 text-ui-fg-subtle txt-medium">
          {t.description}
        </Text>
      </div>

      <div>
        <LocalizedClientLink href="/account">
          <Button
            variant="secondary"
            className="h-10"
            data-testid="sign-in-button"
          >
            {t.signIn}
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt