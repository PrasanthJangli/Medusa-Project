
import { Heading } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useLocale } from "next-intl"

const translations = {
  en: {
    needHelp: "Need help?",
    contact: "Contact",
    returns: "Returns & Exchanges",
  },
  te: {
    needHelp: "సహాయం కావాలా?",
    contact: "సంప్రదించండి",
    returns: "రిటర్న్స్ మరియు మార్పిడి",
  },
  hi: {
    needHelp: "क्या आपको मदद चाहिए?",
    contact: "संपर्क करें",
    returns: "वापसी और एक्सचेंज",
  },
}

const Help = () => {
  const locale = useLocale()

  const normalizedLocale: "en" | "te" | "hi" =
    locale === "te" || locale === "hi" ? locale : "en"

  const t = translations[normalizedLocale]

  return (
    <div className="mt-6">
      <Heading className="text-base-semi">
        {t.needHelp}
      </Heading>

      <div className="text-base-regular my-2">
        <ul className="gap-y-2 flex flex-col">
          <li>
            <LocalizedClientLink href="/contact">
              {t.contact}
            </LocalizedClientLink>
          </li>

          <li>
            <LocalizedClientLink href="/contact">
              {t.returns}
            </LocalizedClientLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Help
