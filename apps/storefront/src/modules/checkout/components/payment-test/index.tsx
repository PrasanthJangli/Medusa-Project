"use client"

import { Badge } from "@modules/common/components/ui"
import { useLocale } from "next-intl"

const PaymentTest = ({ className }: { className?: string }) => {
  const locale = useLocale()

  const translations = {
    en: {
      attention: "Attention:",
      message: "For testing purposes only.",
    },
    te: {
      attention: "గమనిక:",
      message: "పరీక్షల కోసం మాత్రమే.",
    },
    hi: {
      attention: "ध्यान दें:",
      message: "केवल परीक्षण के लिए।",
    },
  }

  const t = translations[locale as keyof typeof translations] || translations.en

  return (
    <Badge color="orange" className={className}>
      <span className="font-semibold">{t.attention}</span> {t.message}
    </Badge>
  )
}

export default PaymentTest