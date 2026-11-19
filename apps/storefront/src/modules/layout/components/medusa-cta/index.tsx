
"use client"

import { Text } from "@modules/common/components/ui"
import { useLocale } from "next-intl"

import Medusa from "../../../common/icons/medusa"
import NextJs from "../../../common/icons/nextjs"

const MedusaCTA = () => {
  const currentLocale = useLocale()
  const locale = currentLocale.split("-")[0].toLowerCase()

  const poweredBy = {
    en: "Powered by",
    te: "సాంకేతిక సహకారం:",
    hi: "द्वारा संचालित",
  }

  const label =
    poweredBy[locale as keyof typeof poweredBy] || poweredBy.en

  return (
    <Text className="flex gap-x-2 txt-compact-small-plus items-center">
      {label}
      <a href="https://www.medusajs.com" target="_blank" rel="noreferrer">
        <Medusa fill="#9ca3af" className="fill-[#9ca3af]" />
      </a>
      &
      <a href="https://nextjs.org" target="_blank" rel="noreferrer">
        <NextJs fill="#9ca3af" />
      </a>
    </Text>
  )
}

export default MedusaCTA
