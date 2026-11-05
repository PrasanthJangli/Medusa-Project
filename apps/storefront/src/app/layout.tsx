import { Metadata } from "next"

import { getBaseURL } from "@lib/util/env"
import {ThemeProvider} from "@modules/theme/theme-provider"

import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <ThemeProvider>
          <div className="relative min-h-screen">
            {props.children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}