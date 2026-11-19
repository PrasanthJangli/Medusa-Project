
"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react"

type ThemeSettings = {
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
  }
  navbar: {
    background: string
    text: string
  }
  footer: {
    background: string
    text: string
    accent: string
  }
  typography: {
    fontFamily: string
    baseFontSize: string
    fontWeight: string
    fontStyle: string
    textTransform: string
    textDecoration: string
    letterSpacing: string
    lineHeight: string
    headingFontFamily: string
    headingWeight: string
    headingFontStyle: string
    headingTextTransform: string
    headingLetterSpacing: string
  }
  buttons: {
    borderRadius: string
    padding: string
    fontWeight: string
  }
  borders: {
    width: string
    style: string
    radius: string
    color: string
  }
  spacing: {
    scale: string
    sectionGap: string
  }
}

type StorefrontTheme = {
  id?: string
  name: string
  preset: string
  settings: ThemeSettings
}

type ThemeContextType = {
  theme: StorefrontTheme
  loading: boolean
  refreshTheme: () => Promise<void>
}

type PresetDefaults = {
  primary: string
  primaryDark: string
  secondary: string
  background: string
  surface: string
  surfaceAlt: string
  text: string
  muted: string
  border: string
  navbarBackground: string
  navbarText: string
  footerBackground: string
  footerText: string
  footerAccent: string
  fontFamily: string
  headingFontFamily: string
  buttonRadius: string
  cardRadius: string
}

const PRESET_DEFAULTS: Record<string, PresetDefaults> = {
  fashion: {
    primary: "#241508",
    primaryDark: "#160D05",
    secondary: "#D4A843",
    background: "#4A321F",
    surface: "#60452F",
    surfaceAlt: "#72543A",
    text: "#FFF2D9",
    muted: "#D5C2A5",
    border: "#A88B65",
    navbarBackground: "#9F141B",
    navbarText: "#FFF2D9",
    footerBackground: "#604024",
    footerText: "#FFF2D9",
    footerAccent: "#D4A843",
    fontFamily: "DM Sans",
    headingFontFamily: "Playfair Display",
    buttonRadius: "8px",
    cardRadius: "12px",
  },

  electronics: {
    primary: "#2563EB",
    primaryDark: "#092B68",
    secondary: "#F59E0B",
    background: "#FFFFFF",
    surface: "#F3F6FC",
    surfaceAlt: "#E5ECF8",
    text: "#111827",
    muted: "#64748B",
    border: "#CBD5E1",
    navbarBackground: "#0B2D70",
    navbarText: "#FFFFFF",
    footerBackground: "#071B3D",
    footerText: "#FFFFFF",
    footerAccent: "#F59E0B",
    fontFamily: "Inter",
    headingFontFamily: "Space Grotesk",
    buttonRadius: "8px",
    cardRadius: "10px",
  },

  furniture: {
    primary: "#795548",
    primaryDark: "#51351F",
    secondary: "#C49A6C",
    background: "#F5F0E8",
    surface: "#FAF7F1",
    surfaceAlt: "#E9DFD1",
    text: "#332820",
    muted: "#796B5D",
    border: "#C8B49B",
    navbarBackground: "#5D4037",
    navbarText: "#FFFFFF",
    footerBackground: "#3E2723",
    footerText: "#F5F0E8",
    footerAccent: "#D7B899",
    fontFamily: "Lora",
    headingFontFamily: "Lora",
    buttonRadius: "6px",
    cardRadius: "4px",
  },

  beauty: {
    primary: "#DB7093",
    primaryDark: "#922653",
    secondary: "#E9B7C7",
    background: "#FFF7FA",
    surface: "#FFFFFF",
    surfaceAlt: "#FCE4EC",
    text: "#3D2933",
    muted: "#8D6878",
    border: "#E9C4D2",
    navbarBackground: "#FCE4EC",
    navbarText: "#3D2933",
    footerBackground: "#6D3F52",
    footerText: "#FFFFFF",
    footerAccent: "#F8BBD0",
    fontFamily: "DM Sans",
    headingFontFamily: "Cormorant Garamond",
    buttonRadius: "24px",
    cardRadius: "16px",
  },

  custom: {
    primary: "#2563EB",
    primaryDark: "#1E40AF",
    secondary: "#F59E0B",
    background: "#FFFFFF",
    surface: "#F9FAFB",
    surfaceAlt: "#F3F4F6",
    text: "#111827",
    muted: "#6B7280",
    border: "#D1D5DB",
    navbarBackground: "#1F2937",
    navbarText: "#FFFFFF",
    footerBackground: "#111827",
    footerText: "#FFFFFF",
    footerAccent: "#F59E0B",
    fontFamily: "Inter",
    headingFontFamily: "Inter",
    buttonRadius: "8px",
    cardRadius: "10px",
  },
}

const DEFAULT_THEME: StorefrontTheme = {
  name: "Default Theme",
  preset: "fashion",
  settings: {
    colors: {
      primary: "#241508",
      secondary: "#D4A843",
      background: "#4A321F",
      text: "#FFF2D9",
    },
    navbar: {
      background: "#9F141B",
      text: "#FFF2D9",
    },
    footer: {
      background: "#604024",
      text: "#FFF2D9",
      accent: "#D4A843",
    },
    typography: {
      fontFamily: "DM Sans",
      baseFontSize: "16px",
      fontWeight: "400",
      fontStyle: "normal",
      textTransform: "none",
      textDecoration: "none",
      letterSpacing: "0",
      lineHeight: "1.5",
      headingFontFamily: "Playfair Display",
      headingWeight: "600",
      headingFontStyle: "normal",
      headingTextTransform: "none",
      headingLetterSpacing: "0",
    },
    buttons: {
      borderRadius: "8px",
      padding: "12px 24px",
      fontWeight: "600",
    },
    borders: {
      width: "1px",
      style: "solid",
      radius: "12px",
      color: "#A88B65",
    },
    spacing: {
      scale: "1",
      sectionGap: "48px",
    },
  },
}

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
)

function getString(value: unknown, fallback: string): string {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value)
  }

  return typeof value === "string" && value.trim()
    ? value.trim()
    : fallback
}

function cssLength(value: unknown, fallback: string): string {
  const result = getString(value, fallback)

  if (/^-?\d+(\.\d+)?$/.test(result)) {
    return `${result}px`
  }

  return result
}

function getSpacingScale(value: unknown): string {
  const scale = getString(value, "normal").toLowerCase()

  const presets: Record<string, string> = {
    compact: "0.8",
    small: "0.8",
    normal: "1",
    medium: "1",
    relaxed: "1.2",
    large: "1.2",
    spacious: "1.4",
  }

  if (presets[scale]) {
    return presets[scale]
  }

  const numeric = Number(scale)

  if (Number.isFinite(numeric) && numeric > 0) {
    return String(Math.min(numeric, 3))
  }

  return "1"
}

function parseSettings(value: unknown): Record<string, any> {
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value)

      return parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed)
        ? parsed
        : {}
    } catch {
      console.warn("Theme settings are not valid JSON.")
      return {}
    }
  }

  return value &&
    typeof value === "object" &&
    !Array.isArray(value)
    ? (value as Record<string, any>)
    : {}
}

function getThemeFromResponse(data: any): any {
  if (!data || typeof data !== "object") {
    return null
  }

  const candidates = [
    data.theme,
    data.storefront_theme,
    data.data?.theme,
    data.data?.storefront_theme,
    data.data,
    data,
  ]

  return (
    candidates.find(
      (item) =>
        item &&
        typeof item === "object" &&
        (item.settings || item.preset || item.name)
    ) ?? null
  )
}

function normalizeTheme(rawTheme: any): StorefrontTheme {
  if (!rawTheme) {
    return DEFAULT_THEME
  }

  const requestedPreset = getString(
    rawTheme.preset,
    "fashion"
  ).toLowerCase()

  const preset = PRESET_DEFAULTS[requestedPreset]
    ? requestedPreset
    : "fashion"

  const defaults = PRESET_DEFAULTS[preset]

  // Supports both direct settings and nested settings.settings.
  const parsedSettings = parseSettings(rawTheme.settings)

  const rawSettings = parsedSettings.settings
    ? parseSettings(parsedSettings.settings)
    : parsedSettings

  const rawColors = parseSettings(rawSettings.colors)
  const rawNavbar = parseSettings(rawSettings.navbar)
  const rawFooter = parseSettings(rawSettings.footer)
  const rawTypography = parseSettings(rawSettings.typography)
  const rawButtons = parseSettings(rawSettings.buttons)
  const rawBorders = parseSettings(rawSettings.borders)
  const rawSpacing = parseSettings(rawSettings.spacing)
  const rawCards = parseSettings(rawSettings.cards)

  const typography = {
    fontFamily: getString(
      rawTypography.fontFamily,
      defaults.fontFamily
    ),
    baseFontSize: cssLength(
      rawTypography.baseFontSize,
      "16px"
    ),
    fontWeight: getString(rawTypography.fontWeight, "400"),
    fontStyle: getString(rawTypography.fontStyle, "normal"),
    textTransform: getString(
      rawTypography.textTransform,
      "none"
    ),
    textDecoration: getString(
      rawTypography.textDecoration,
      "none"
    ),
    letterSpacing: cssLength(
      rawTypography.letterSpacing,
      "0"
    ),
    lineHeight: getString(rawTypography.lineHeight, "1.5"),
    headingFontFamily: getString(
      rawTypography.headingFontFamily ??
        rawTypography.fontFamily,
      defaults.headingFontFamily
    ),
    headingWeight: getString(
      rawTypography.headingWeight,
      "600"
    ),
    headingFontStyle: getString(
      rawTypography.headingFontStyle,
      "normal"
    ),
    headingTextTransform: getString(
      rawTypography.headingTextTransform,
      "none"
    ),
    headingLetterSpacing: cssLength(
      rawTypography.headingLetterSpacing,
      "0"
    ),
  }

  const cardRadius = cssLength(
    rawCards.borderRadius ?? rawBorders.radius,
    defaults.cardRadius
  )

  return {
    id: rawTheme.id,
    name: getString(rawTheme.name, "Storefront Theme"),
    preset,

    settings: {
      colors: {
        primary: getString(
          rawColors.primary,
          defaults.primary
        ),
        secondary: getString(
          rawColors.secondary,
          defaults.secondary
        ),
        background: getString(
          rawColors.background,
          defaults.background
        ),
        text: getString(
          rawColors.text,
          defaults.text
        ),
      },

      navbar: {
        background: getString(
          rawNavbar.background ?? rawColors.navbarBackground,
          defaults.navbarBackground
        ),
        text: getString(
          rawNavbar.text ?? rawColors.navbarText,
          defaults.navbarText
        ),
      },

      footer: {
        background: getString(
          rawFooter.background ?? rawColors.footerBackground,
          defaults.footerBackground
        ),
        text: getString(
          rawFooter.text ?? rawColors.footerText,
          defaults.footerText
        ),
        accent: getString(
          rawFooter.accent ?? rawColors.footerAccent,
          defaults.footerAccent
        ),
      },

      typography,

      buttons: {
        borderRadius: cssLength(
          rawButtons.borderRadius,
          defaults.buttonRadius
        ),
        padding: getString(
          rawButtons.padding,
          "12px 24px"
        ),
        fontWeight: getString(
          rawButtons.fontWeight,
          "600"
        ),
      },

      borders: {
        width: cssLength(
          rawBorders.width,
          "1px"
        ),
        style: getString(
          rawBorders.style,
          "solid"
        ),
        radius: cardRadius,
        color: getString(
          rawBorders.color,
          defaults.border
        ),
      },

      spacing: {
        scale: getSpacingScale(rawSpacing.scale),
        sectionGap: cssLength(
          rawSpacing.sectionGap,
          "48px"
        ),
      },
    },
  }
}

export function ThemeProvider({
  children,
}: {
  children: ReactNode
}) {
  const [theme, setTheme] = useState<StorefrontTheme>(
    DEFAULT_THEME
  )

  const [loading, setLoading] = useState(true)

  const refreshTheme = useCallback(async () => {
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

      const publishableKey =
        process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

      if (!backendUrl) {
        console.warn("Medusa backend URL is missing.")
        return
      }

      const response = await fetch(
        `${backendUrl.replace(/\/$/, "")}/store/storefront-theme`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(publishableKey
              ? {
                  "x-publishable-api-key": publishableKey,
                }
              : {}),
          },
          cache: "no-store",
        }
      )

      if (!response.ok) {
        throw new Error(
          `Theme API failed: ${response.status}`
        )
      }

      const data = await response.json()
      const rawTheme = getThemeFromResponse(data)

      if (!rawTheme) {
        console.warn(
          "No published storefront theme was returned."
        )
        return
      }

      const normalizedTheme = normalizeTheme(rawTheme)

      setTheme(normalizedTheme)

      console.log("Storefront theme loaded:", {
        name: normalizedTheme.name,
        preset: normalizedTheme.preset,
        settings: normalizedTheme.settings,
      })
    } catch (error) {
      console.error(
        "Failed to load storefront theme:",
        error
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshTheme()
  }, [refreshTheme])

  // Admin iframe live preview listener.
  useEffect(() => {
    const isPreview =
      new URLSearchParams(window.location.search).get(
        "themePreview"
      ) === "1"

    if (!isPreview || window.parent === window) {
      return
    }

    let trustedAdminOrigin = ""

    try {
      trustedAdminOrigin = document.referrer
        ? new URL(document.referrer).origin
        : ""
    } catch {
      trustedAdminOrigin = ""
    }

    if (!trustedAdminOrigin) {
      console.warn(
        "Theme preview: admin origin could not be verified."
      )
      return
    }

    const handlePreviewMessage = (
      event: MessageEvent
    ) => {
      if (event.source !== window.parent) {
        return
      }

      if (event.origin !== trustedAdminOrigin) {
        return
      }

      const message = event.data

      if (!message || typeof message !== "object") {
        return
      }

      if (
        message.type === "STOREFRONT_THEME_PREVIEW_RESET"
      ) {
        void refreshTheme()
        return
      }

      if (message.type !== "STOREFRONT_THEME_PREVIEW") {
        return
      }

      // Accept both object and JSON string settings.
      if (
        !message.settings ||
        (
          typeof message.settings !== "object" &&
          typeof message.settings !== "string"
        )
      ) {
        return
      }

      const previewTheme = normalizeTheme({
        id: message.id,
        name:
          typeof message.name === "string"
            ? message.name
            : "Preview Theme",
        preset:
          typeof message.preset === "string"
            ? message.preset
            : "custom",
        settings: message.settings,
      })

      setTheme(previewTheme)

      console.log("Live theme preview applied:", {
        name: previewTheme.name,
        preset: previewTheme.preset,
        settings: previewTheme.settings,
      })
    }

    window.addEventListener(
      "message",
      handlePreviewMessage
    )

    window.parent.postMessage(
      {
        type: "STOREFRONT_THEME_PREVIEW_READY",
      },
      trustedAdminOrigin
    )

    return () => {
      window.removeEventListener(
        "message",
        handlePreviewMessage
      )
    }
  }, [refreshTheme])

  const themeStyles = useMemo(() => {
    const {
      colors,
      navbar,
      footer,
      typography,
      buttons,
      borders,
      spacing,
    } = theme.settings

    const presetDefaults =
      PRESET_DEFAULTS[theme.preset] ??
      PRESET_DEFAULTS.custom

    return {
      "--theme-primary": colors.primary,
      "--theme-primary-dark": presetDefaults.primaryDark,
      "--theme-secondary": colors.secondary,
      "--theme-accent": colors.secondary,

      "--theme-background": colors.background,
      "--theme-surface": presetDefaults.surface,
      "--theme-surface-alt": presetDefaults.surfaceAlt,
      "--theme-text": colors.text,
      "--theme-muted": presetDefaults.muted,
      "--theme-border": borders.color,

      "--theme-navbar-background": navbar.background,
      "--theme-navbar-text": navbar.text,

      "--theme-nav-background": navbar.background,
      "--theme-nav-secondary": navbar.background,

      "--theme-footer-background": footer.background,
      "--theme-footer-text": footer.text,
      "--theme-footer-accent": footer.accent,

      "--theme-font-family": typography.fontFamily,
      "--theme-font-body": typography.fontFamily,
      "--theme-font-heading": typography.headingFontFamily,

      "--theme-base-font-size": typography.baseFontSize,
      "--theme-font-weight": typography.fontWeight,
      "--theme-font-style": typography.fontStyle,
      "--theme-text-transform": typography.textTransform,
      "--theme-text-decoration": typography.textDecoration,
      "--theme-letter-spacing": typography.letterSpacing,
      "--theme-line-height": typography.lineHeight,

      "--theme-heading-weight": typography.headingWeight,
      "--theme-heading-font-style":
        typography.headingFontStyle,
      "--theme-heading-text-transform":
        typography.headingTextTransform,
      "--theme-heading-letter-spacing":
        typography.headingLetterSpacing,

      "--theme-button-radius": buttons.borderRadius,
      "--theme-button-padding": buttons.padding,
      "--theme-button-font-weight": buttons.fontWeight,
      "--theme-button-text": "#FFFFFF",

      "--theme-border-width": borders.width,
      "--theme-border-style": borders.style,
      "--theme-border-color": borders.color,
      "--theme-border-radius": borders.radius,

      "--theme-card-radius": borders.radius,

      "--theme-spacing-scale": spacing.scale,
      "--theme-section-gap": spacing.sectionGap,
    } as CSSProperties
  }, [theme])

  const contextValue = useMemo(
    () => ({
      theme,
      loading,
      refreshTheme,
    }),
    [theme, loading, refreshTheme]
  )

  return (
    <ThemeContext.Provider value={contextValue}>
      <div
        className="storefront-theme min-h-screen"
        style={{
          ...themeStyles,
          backgroundColor: theme.settings.colors.background,
          color: theme.settings.colors.text,
          fontFamily: theme.settings.typography.fontFamily,
          fontSize: theme.settings.typography.baseFontSize,
          fontWeight: theme.settings.typography.fontWeight,
          fontStyle: theme.settings.typography.fontStyle,
          letterSpacing: theme.settings.typography.letterSpacing,
          lineHeight: theme.settings.typography.lineHeight,
        }}
        data-theme={theme.preset}
        data-theme-name={theme.name}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useStorefrontTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error(
      "useStorefrontTheme must be used inside ThemeProvider"
    )
  }

  return context
}
