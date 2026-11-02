
"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

type ThemeSettings = {
  colors?: {
    primary?: string
    secondary?: string
    background?: string
    text?: string
  }
  typography?: {
    fontFamily?: string
  }
  buttons?: {
    borderRadius?: string
  }
}

type Theme = {
  name: string
  preset: string
  settings: ThemeSettings
}

const ThemeContext = createContext<Theme | null>(null)

export function useStorefrontTheme() {
  return useContext(ThemeContext)
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [theme, setTheme] = useState<Theme | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadTheme() {
      try {
        const backendUrl =
          process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

        const publishableKey =
          process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

        if (!backendUrl || !publishableKey) {
          console.error("Theme API configuration is missing")
          return
        }

        const response = await fetch(
          `${backendUrl}/store/storefront-theme`,
          {
            headers: {
              "x-publishable-api-key": publishableKey,
            },
            cache: "no-store",
          }
        )

        if (!response.ok) {
          throw new Error(
            `Unable to fetch published theme: ${response.status}`
          )
        }

        const data = await response.json()

        if (!isMounted || !data.theme) return

        const activeTheme = data.theme as Theme

        setTheme(activeTheme)
      } catch (error) {
        console.error("Theme loading error:", error)
      }
    }

    loadTheme()

    return () => {
      isMounted = false
    }
  }, [])

  const colors = theme?.settings?.colors
  const typography = theme?.settings?.typography
  const buttons = theme?.settings?.buttons

  return (
    <ThemeContext.Provider value={theme}>
      <div
        className="storefront-theme theme-background min-h-screen"
        data-theme={theme?.preset || undefined}
        style={
          {
            ...(colors?.primary && {
              "--theme-primary": colors.primary,
            }),
            ...(colors?.secondary && {
              "--theme-secondary": colors.secondary,
            }),
            ...(colors?.background && {
              "--theme-background": colors.background,
            }),
            ...(colors?.text && {
              "--theme-text": colors.text,
            }),
            ...(typography?.fontFamily && {
              "--theme-font-family": typography.fontFamily,
            }),
            ...(buttons?.borderRadius && {
              "--theme-button-radius": buttons.borderRadius,
            }),
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
