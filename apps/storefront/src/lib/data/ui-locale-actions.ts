
"use server"

import { cookies } from "next/headers"

const SUPPORTED_UI_LOCALES = ["en", "te", "hi"] as const

type UiLocale = (typeof SUPPORTED_UI_LOCALES)[number]

export async function getUiLocale(): Promise<string> {
  const cookieStore = await cookies()
  const savedLocale = cookieStore.get("_ui_locale")?.value

  if (
    savedLocale &&
    SUPPORTED_UI_LOCALES.includes(savedLocale as UiLocale)
  ) {
    return savedLocale
  }

  return "en"
}

export async function updateUiLocale(locale: string) {
  if (!SUPPORTED_UI_LOCALES.includes(locale as UiLocale)) {
    throw new Error("Unsupported UI language")
  }

  const cookieStore = await cookies()

  cookieStore.set("_ui_locale", locale, {
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  })

  return { success: true }
}
