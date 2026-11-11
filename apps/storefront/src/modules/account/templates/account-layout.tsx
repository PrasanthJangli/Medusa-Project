
import React from "react"

import UnderlineLink from "@modules/common/components/interactive-link"
import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"
import { useLocale } from "next-intl"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const translations = {
  en: {
    questions: "Got questions?",
    description:
      "You can find frequently asked questions and answers on our customer service page.",
    customerService: "Customer Service",
  },
  te: {
    questions: "మీకు ఏవైనా ప్రశ్నలు ఉన్నాయా?",
    description:
      "తరచుగా అడిగే ప్రశ్నలు మరియు వాటి సమాధానాల కోసం మా కస్టమర్ సేవల పేజీని సందర్శించండి.",
    customerService: "కస్టమర్ సేవలు",
  },
  hi: {
    questions: "क्या आपके कोई सवाल हैं?",
    description:
      "अक्सर पूछे जाने वाले सवालों और उनके जवाबों के लिए हमारा ग्राहक सेवा पेज देखें।",
    customerService: "ग्राहक सेवा",
  },
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  const locale = useLocale()

  const t =
    translations[locale as keyof typeof translations] ?? translations.en

  return (
    <div className="flex-1 small:py-12" data-testid="account-page">
      <div className="flex-1 content-container h-full max-w-5xl mx-auto bg-white flex flex-col">
        <div className="grid grid-cols-1 small:grid-cols-[240px_1fr] py-12">
          <div>{customer && <AccountNav customer={customer} />}</div>
          <div className="flex-1">{children}</div>
        </div>

        <div className="flex flex-col small:flex-row items-end justify-between small:border-t border-gray-200 py-12 gap-8">
          <div>
            <h3 className="text-xl-semi mb-4">{t.questions}</h3>
            <span className="txt-medium">{t.description}</span>
          </div>

          <div>
            <UnderlineLink href="/customer-service">
              {t.customerService}
            </UnderlineLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
