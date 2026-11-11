
import { getRequestConfig } from "next-intl/server"
import { cookies } from "next/headers"

const locales = ["en", "te", "hi"] as const

type Locale = (typeof locales)[number]

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const savedLocale = cookieStore.get("_ui_locale")?.value

  const locale: Locale =
    locales.includes(savedLocale as Locale)
      ? (savedLocale as Locale)
      : "en"

  const messages = (
    await import(`../messages/${locale}.json`)
  ).default

  return {
    locale,
    messages,
  }
})
