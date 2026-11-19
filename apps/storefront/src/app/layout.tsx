
import { Metadata } from "next"

import { getBaseURL } from "@lib/util/env"
import { ThemeProvider } from "@modules/theme/theme-provider"

import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"

import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function RootLayout(props: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const messages = await getMessages()

  const direction = ["ar", "ur"].includes(locale) ? "rtl" : "ltr"

  return (
    <html lang={locale} dir={direction} data-mode="light">
      <body>
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
        >
          <ThemeProvider>
            <div className="relative min-h-screen">
              {props.children}
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
