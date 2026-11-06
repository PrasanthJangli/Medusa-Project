
"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"

import { updateUiLocale } from "@lib/data/ui-locale-actions"

const languages = [
  { code: "en", label: "English" },
  { code: "te", label: "తెలుగు" },
  { code: "hi", label: "हिन्दी" },
]

type UiLanguageSelectProps = {
  currentLocale: string
}

export default function UiLanguageSelect({
  currentLocale,
}: UiLanguageSelectProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleLanguageChange = (locale: string) => {
    startTransition(async () => {
      try {
        await updateUiLocale(locale)
        router.refresh()
      } catch (error) {
        console.error("Unable to change UI language:", error)
      }
    })
  }

  return (
    <select
      aria-label="Select display language"
      value={currentLocale}
      disabled={isPending}
      onChange={(event) => handleLanguageChange(event.target.value)}
      className="h-9 max-w-[120px] rounded-lg border border-white/30 bg-white/10 px-2 text-xs font-semibold text-white outline-none transition hover:bg-white/20 disabled:opacity-50 sm:h-10 sm:text-sm"
    >
      {languages.map((language) => (
        <option
          key={language.code}
          value={language.code}
          className="bg-white text-gray-900"
        >
          {language.label}
        </option>
      ))}
    </select>
  )
}
