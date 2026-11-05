import { defineRouteConfig } from "@medusajs/admin-sdk"
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

type Preset =
  | "fashion"
  | "electronics"
  | "furniture"
  | "beauty"
  | "custom"

type ThemeStatus = "draft" | "published" | "archived"

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

type Theme = {
  id: string
  name: string
  preset: Preset
  settings: ThemeSettings
  status: ThemeStatus
}

type MessageType = "success" | "error" | "info"

type ApiResponse = {
  message?: string
  themes?: Theme[]
  data?: Theme[] | Theme | ApiResponse
  theme?: Theme
  storefront_theme?: Theme
  theme_id?: string
  id?: string
  status?: ThemeStatus
}

const STOREFRONT_PREVIEW_URL =
  "http://localhost:8000/in?themePreview=1"

const STOREFRONT_ORIGIN = "http://localhost:8000"

const presets: {
  id: Preset
  label: string
  description: string
}[] = [
  { id: "fashion", label: "Fashion", description: "Luxury and elegant" },
  { id: "electronics", label: "Electronics", description: "Modern technology" },
  { id: "furniture", label: "Furniture", description: "Natural and minimal" },
  { id: "beauty", label: "Beauty", description: "Soft and premium" },
  { id: "custom", label: "Custom", description: "Your own design" },
]

const defaultTypography: ThemeSettings["typography"] = {
  fontFamily: "Inter",
  baseFontSize: "16px",
  fontWeight: "400",
  fontStyle: "normal",
  textTransform: "none",
  textDecoration: "none",
  letterSpacing: "0px",
  lineHeight: "1.6",
  headingFontFamily: "Inter",
  headingWeight: "700",
  headingFontStyle: "normal",
  headingTextTransform: "none",
  headingLetterSpacing: "0px",
}

const presetSettings: Record<Preset, ThemeSettings> = {
  fashion: {
    colors: {
      primary: "#241508",
      secondary: "#D4A843",
      background: "#4A321F",
      text: "#FFF2D9",
    },
    navbar: {
      background: "#241508",
      text: "#FFF2D9",
    },
    footer: {
      background: "#241508",
      text: "#FFF2D9",
      accent: "#D4A843",
    },
    typography: {
      ...defaultTypography,
      fontFamily: "DM Sans",
      baseFontSize: "16px",
      fontWeight: "400",
      headingFontFamily: "Playfair Display",
      headingWeight: "700",
      headingLetterSpacing: "0.3px",
    },
    buttons: {
      borderRadius: "2px",
      padding: "12px 22px",
      fontWeight: "600",
    },
    borders: {
      width: "1px",
      style: "solid",
      radius: "2px",
      color: "#D4A843",
    },
    spacing: {
      scale: "comfortable",
      sectionGap: "48px",
    },
  },

  electronics: {
    colors: {
      primary: "#0B2D70",
      secondary: "#00D4F0",
      background: "#142F59",
      text: "#F0F7FF",
    },
    navbar: {
      background: "#0B2D70",
      text: "#FFFFFF",
    },
    footer: {
      background: "#071B40",
      text: "#F0F7FF",
      accent: "#00D4F0",
    },
    typography: {
      ...defaultTypography,
      fontFamily: "Inter",
      baseFontSize: "15px",
      fontWeight: "400",
      headingFontFamily: "Space Grotesk",
      headingWeight: "700",
    },
    buttons: {
      borderRadius: "8px",
      padding: "12px 20px",
      fontWeight: "700",
    },
    borders: {
      width: "1px",
      style: "solid",
      radius: "8px",
      color: "#00D4F0",
    },
    spacing: {
      scale: "medium",
      sectionGap: "36px",
    },
  },

  furniture: {
    colors: {
      primary: "#422513",
      secondary: "#D49A5B",
      background: "#51351F",
      text: "#FFF0DC",
    },
    navbar: {
      background: "#422513",
      text: "#FFF0DC",
    },
    footer: {
      background: "#2B1A10",
      text: "#FFF0DC",
      accent: "#D49A5B",
    },
    typography: {
      ...defaultTypography,
      fontFamily: "Lora",
      baseFontSize: "16px",
      fontWeight: "400",
      headingFontFamily: "Lora",
      headingWeight: "600",
    },
    buttons: {
      borderRadius: "8px",
      padding: "13px 22px",
      fontWeight: "600",
    },
    borders: {
      width: "1px",
      style: "solid",
      radius: "8px",
      color: "#D49A5B",
    },
    spacing: {
      scale: "comfortable",
      sectionGap: "48px",
    },
  },

  beauty: {
    colors: {
      primary: "#781B45",
      secondary: "#F2A0C0",
      background: "#702D4D",
      text: "#FFF0F5",
    },
    navbar: {
      background: "#781B45",
      text: "#FFF0F5",
    },
    footer: {
      background: "#4D102C",
      text: "#FFF0F5",
      accent: "#F2A0C0",
    },
    typography: {
      ...defaultTypography,
      fontFamily: "DM Sans",
      baseFontSize: "16px",
      fontWeight: "400",
      headingFontFamily: "Cormorant Garamond",
      headingWeight: "600",
      headingFontStyle: "normal",
    },
    buttons: {
      borderRadius: "30px",
      padding: "13px 24px",
      fontWeight: "600",
    },
    borders: {
      width: "1px",
      style: "solid",
      radius: "12px",
      color: "#F2A0C0",
    },
    spacing: {
      scale: "comfortable",
      sectionGap: "48px",
    },
  },

  custom: {
    colors: {
      primary: "#2563EB",
      secondary: "#FACC15",
      background: "#FFFFFF",
      text: "#111827",
    },
    navbar: {
      background: "#0B2D70",
      text: "#FFFFFF",
    },
    footer: {
      background: "#071B3D",
      text: "#FFFFFF",
      accent: "#FACC15",
    },
    typography: {
      ...defaultTypography,
      fontFamily: "Inter",
      baseFontSize: "16px",
      fontWeight: "400",
      headingFontFamily: "Inter",
      headingWeight: "700",
    },
    buttons: {
      borderRadius: "8px",
      padding: "12px 20px",
      fontWeight: "600",
    },
    borders: {
      width: "1px",
      style: "solid",
      radius: "8px",
      color: "#E5E7EB",
    },
    spacing: {
      scale: "comfortable",
      sectionGap: "40px",
    },
  },
}

const fontOptions = [
  "Inter",
  "Playfair Display",
  "Lora",
  "Space Grotesk",
  "DM Sans",
  "Nunito Sans",
  "Cormorant Garamond",
]

const buttonOptions = [
  { label: "Sharp", value: "2px" },
  { label: "Rounded", value: "8px" },
  { label: "Soft Rounded", value: "12px" },
  { label: "Pill", value: "30px" },
]

const spacingOptions = [
  {
    label: "Compact",
    value: "compact",
    description: "Less space",
  },
  {
    label: "Medium",
    value: "medium",
    description: "Balanced layout",
  },
  {
    label: "Comfortable",
    value: "comfortable",
    description: "More breathing room",
  },
]

const normalizeSettings = (
  settings?: Partial<ThemeSettings> | null,
  preset: Preset = "custom"
): ThemeSettings => {
  const defaults = presetSettings[preset]
  const raw = (settings ?? {}) as any

  return {
    colors: {
      ...defaults.colors,
      ...(raw.colors ?? {}),
    },
    navbar: {
      ...defaults.navbar,
      background:
        raw.navbar?.background ??
        raw.colors?.navbarBackground ??
        defaults.navbar.background,
      text:
        raw.navbar?.text ??
        raw.colors?.navbarText ??
        defaults.navbar.text,
    },
    footer: {
      ...defaults.footer,
      background:
        raw.footer?.background ??
        raw.colors?.footerBackground ??
        defaults.footer.background,
      text:
        raw.footer?.text ??
        raw.colors?.footerText ??
        defaults.footer.text,
      accent: raw.footer?.accent ?? defaults.footer.accent,
    },
    typography: {
      ...defaults.typography,
      ...defaultTypography,
      ...(raw.typography ?? {}),
      // Old themes may only have fontFamily, baseFontSize and headingWeight.
      headingFontFamily:
        raw.typography?.headingFontFamily ??
        raw.typography?.fontFamily ??
        defaults.typography.headingFontFamily,
      headingWeight:
        raw.typography?.headingWeight ??
        defaults.typography.headingWeight,
    },
    buttons: {
      ...defaults.buttons,
      ...(raw.buttons ?? {}),
    },
    borders: {
      ...defaults.borders,
      ...(raw.borders ?? {}),
    },
    spacing: {
      ...defaults.spacing,
      ...(raw.spacing ?? {}),
    },
  }
}

const isPreset = (value: unknown): value is Preset =>
  typeof value === "string" &&
  presets.some((item) => item.id === value)

const isThemeStatus = (value: unknown): value is ThemeStatus =>
  value === "draft" ||
  value === "published" ||
  value === "archived"

const normalizeTheme = (value: unknown): Theme | null => {
  if (!value || typeof value !== "object") return null

  const item = value as Record<string, unknown>

  if (
    (typeof item.id !== "string" && typeof item.id !== "number") ||
    typeof item.name !== "string"
  ) {
    return null
  }

  const selectedPreset = isPreset(item.preset)
    ? item.preset
    : "custom"

  return {
    id: String(item.id),
    name: item.name,
    preset: selectedPreset,
    status: isThemeStatus(item.status)
      ? item.status
      : "draft",
    settings: normalizeSettings(
      item.settings as Partial<ThemeSettings> | undefined,
      selectedPreset
    ),
  }
}

const getPresetName = (preset: Preset) => {
  const selected = presets.find((item) => item.id === preset)
  return `${selected?.label ?? "Custom"} Theme`
}

const StorefrontThemesPage = () => {
  const [themes, setThemes] = useState<Theme[]>([])
  const [name, setName] = useState("Fashion Theme")
  const [preset, setPreset] = useState<Preset>("fashion")

  const [settings, setSettings] = useState<ThemeSettings>(
    normalizeSettings(presetSettings.fashion, "fashion")
  )

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [restoringId, setRestoringId] = useState<string | null>(null)

  const [message, setMessage] = useState("")
  const [messageType, setMessageType] =
    useState<MessageType>("info")

  const previewFrameRef = useRef<HTMLIFrameElement>(null)

  const [previewReady, setPreviewReady] = useState(false)
  const [previewReloadKey, setPreviewReloadKey] = useState(0)

  const showMessage = (
    text: string,
    type: MessageType = "info"
  ) => {
    setMessage(text)
    setMessageType(type)
  }

  const readJson = async (
    response: Response
  ): Promise<ApiResponse> => {
    const responseText = await response.text()

    if (!responseText) return {}

    try {
      return JSON.parse(responseText) as ApiResponse
    } catch {
      throw new Error("The server returned an invalid response.")
    }
  }

  const loadThemes = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true)

    try {
      const response = await fetch("/admin/storefront-themes", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      })

      const data = await readJson(response)

      if (!response.ok) {
        throw new Error(data.message || "Unable to load themes.")
      }

      const responseData = data.data

      const received = Array.isArray(data.themes)
        ? data.themes
        : Array.isArray(responseData)
          ? responseData
          : []

      const normalized = received
        .map((theme) => normalizeTheme(theme))
        .filter((theme): theme is Theme => theme !== null)

      setThemes(normalized)

      return normalized
    } catch (error) {
      showMessage(
        error instanceof Error
          ? error.message
          : "Unable to load themes.",
        "error"
      )

      return []
    } finally {
      if (showLoader) setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadThemes()
  }, [loadThemes])

  const sendPreviewSettings = useCallback(() => {
    if (!previewReady) return

    const iframeWindow = previewFrameRef.current?.contentWindow

    if (!iframeWindow) return

    iframeWindow.postMessage(
      {
        type: "STOREFRONT_THEME_PREVIEW",
        name,
        preset,
        settings: normalizeSettings(settings, preset),
      },
      STOREFRONT_ORIGIN
    )
  }, [previewReady, name, preset, settings])

  useEffect(() => {
    const handlePreviewMessage = (event: MessageEvent) => {
      if (event.origin !== STOREFRONT_ORIGIN) return

      if (event.source !== previewFrameRef.current?.contentWindow) {
        return
      }

      if (
        event.data?.type === "STOREFRONT_THEME_PREVIEW_READY"
      ) {
        setPreviewReady(true)
      }
    }

    window.addEventListener("message", handlePreviewMessage)

    return () => {
      window.removeEventListener("message", handlePreviewMessage)
    }
  }, [])

  useEffect(() => {
    sendPreviewSettings()
  }, [sendPreviewSettings])

  const reloadStorefrontPreview = () => {
    setPreviewReady(false)
    setPreviewReloadKey((current) => current + 1)
  }

  const publishedThemes = useMemo(
    () => themes.filter((theme) => theme.status === "published"),
    [themes]
  )

  const activeTheme = publishedThemes[0]

  const archivedThemes = useMemo(
    () => themes.filter((theme) => theme.status === "archived"),
    [themes]
  )

  const handlePresetChange = (selected: Preset) => {
    setPreset(selected)
    setSettings(normalizeSettings(presetSettings[selected], selected))
    setName(getPresetName(selected))
    setMessage("")
  }

  const updateSettings = (
    section: keyof ThemeSettings,
    key: string,
    value: string
  ) => {
    setSettings((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: value,
      },
    }))
  }

  const updateColor = (
    key: keyof ThemeSettings["colors"],
    value: string
  ) => {
    updateSettings("colors", key, value)
  }

  const updateNavbarColor = (
    key: keyof ThemeSettings["navbar"],
    value: string
  ) => {
    updateSettings("navbar", key, value)
  }

  const updateFooterColor = (
    key: keyof ThemeSettings["footer"],
    value: string
  ) => {
    updateSettings("footer", key, value)
  }

  const resetSettings = () => {
    setPreset("fashion")
    setName("Fashion Theme")
    setSettings(normalizeSettings(presetSettings.fashion, "fashion"))

    showMessage(
      "Settings reset to Fashion preset.",
      "success"
    )
  }

  const extractTheme = (
    data: ApiResponse
  ): Record<string, unknown> => {
    const result = data as Record<string, unknown>
    const nestedData = result.data

    if (result.theme && typeof result.theme === "object") {
      return result.theme as Record<string, unknown>
    }

    if (
      result.storefront_theme &&
      typeof result.storefront_theme === "object"
    ) {
      return result.storefront_theme as Record<string, unknown>
    }

    if (
      nestedData &&
      !Array.isArray(nestedData) &&
      typeof nestedData === "object"
    ) {
      const nested = nestedData as Record<string, unknown>

      if (nested.theme && typeof nested.theme === "object") {
        return nested.theme as Record<string, unknown>
      }

      if (
        nested.storefront_theme &&
        typeof nested.storefront_theme === "object"
      ) {
        return nested.storefront_theme as Record<string, unknown>
      }

      return nested
    }

    return result
  }

  const extractThemeId = (
    data: ApiResponse
  ): string | null => {
    const theme = extractTheme(data)

    const id =
      theme.id ??
      theme.theme_id ??
      data.theme_id ??
      data.id

    return typeof id === "string" || typeof id === "number"
      ? String(id)
      : null
  }

  const publishThemeById = async (themeId: string) => {
    const response = await fetch(
      `/admin/storefront-themes/${encodeURIComponent(themeId)}/publish`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      }
    )

    const data = await readJson(response)

    if (!response.ok) {
      throw new Error(
        data.message || "Unable to publish theme."
      )
    }

    return data
  }

  const restoreTheme = async (theme: Theme) => {
    if (restoringId || saving || loading) return

    if (theme.status !== "archived") {
      showMessage("Only archived themes can be restored.", "error")
      return
    }

    setRestoringId(theme.id)
    setMessage("")

    try {
      await publishThemeById(theme.id)
      await loadThemes(false)

      previewFrameRef.current?.contentWindow?.postMessage(
        {
          type: "STOREFRONT_THEME_PREVIEW_RESET",
        },
        STOREFRONT_ORIGIN
      )

      setPreviewReady(false)
      setPreviewReloadKey((current) => current + 1)

      showMessage(
        `"${theme.name}" restored and published successfully.`,
        "success"
      )
    } catch (error) {
      showMessage(
        error instanceof Error
          ? error.message
          : "Unable to restore theme.",
        "error"
      )

      await loadThemes(false)
    } finally {
      setRestoringId(null)
    }
  }

  const saveAndPublishTheme = async () => {
    if (saving || loading) return

    const trimmedName = name.trim()

    if (!trimmedName) {
      showMessage("Please enter a theme name.", "error")
      return
    }

    setSaving(true)
    setMessage("")

    try {
      const saveResponse = await fetch(
        "/admin/storefront-themes",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: trimmedName,
            preset,
            settings: normalizeSettings(settings, preset),
          }),
        }
      )

      const saveData = await readJson(saveResponse)

      if (!saveResponse.ok) {
        throw new Error(
          saveData.message || "Unable to save theme."
        )
      }

      let themeId = extractThemeId(saveData)

      if (!themeId) {
        const refreshedThemes = await loadThemes(false)

        const matchingTheme = refreshedThemes.find(
          (theme) =>
            theme.name.trim().toLowerCase() ===
              trimmedName.toLowerCase() &&
            theme.preset === preset
        )

        if (matchingTheme) {
          themeId = matchingTheme.id
        }
      }

      if (!themeId) {
        throw new Error(
          "Theme saved, but theme ID was not returned by the API."
        )
      }

      await publishThemeById(themeId)
      await loadThemes(false)

      previewFrameRef.current?.contentWindow?.postMessage(
        {
          type: "STOREFRONT_THEME_PREVIEW_RESET",
        },
        STOREFRONT_ORIGIN
      )

      showMessage(
        `"${trimmedName}" saved and published successfully!`,
        "success"
      )
    } catch (error) {
      showMessage(
        error instanceof Error
          ? error.message
          : "Unable to save and publish theme.",
        "error"
      )

      await loadThemes(false)
    } finally {
      setSaving(false)
    }
  }

  const colorFields: {
    key: keyof ThemeSettings["colors"]
    label: string
    description: string
  }[] = [
    {
      key: "primary",
      label: "Primary",
      description: "Main brand color",
    },
    {
      key: "secondary",
      label: "Secondary",
      description: "Accent color",
    },
    {
      key: "background",
      label: "Background",
      description: "Store background",
    },
    {
      key: "text",
      label: "Text",
      description: "Text color",
    },
  ]

  const navbarColorFields: {
    key: keyof ThemeSettings["navbar"]
    label: string
    description: string
  }[] = [
    {
      key: "background",
      label: "Navbar Background",
      description: "Navigation background",
    },
    {
      key: "text",
      label: "Navbar Text",
      description: "Logo and menu text",
    },
  ]

  const footerColorFields: {
    key: keyof ThemeSettings["footer"]
    label: string
    description: string
  }[] = [
    {
      key: "background",
      label: "Footer Background",
      description: "Footer background",
    },
    {
      key: "text",
      label: "Footer Text",
      description: "Footer text color",
    },
    {
      key: "accent",
      label: "Footer Accent",
      description: "Links and highlights",
    },
  ]

  const typography = settings.typography

  return (
    <div className="theme-customizer-page">
      <style>{`
        .theme-customizer-page {
          max-width:1450px;
          margin:0 auto;
          padding:30px 28px 60px;
          color:#172033;
          font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif;
        }

        .theme-customizer-page * { box-sizing:border-box; }

        .theme-page-header {
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:20px;
          flex-wrap:wrap;
          margin-bottom:28px;
        }

        .theme-eyebrow {
          color:#2563eb;
          font-size:11px;
          font-weight:800;
          letter-spacing:1.5px;
          text-transform:uppercase;
        }

        .theme-page-header h1 {
          font-size:28px;
          font-weight:800;
          margin:7px 0;
          letter-spacing:-.7px;
          color:#111827;
        }

        .theme-page-header p {
          color:#64748b;
          font-size:14px;
          margin:0;
        }

        .theme-refresh {
          padding:10px 17px;
          border:1px solid #dbe2ea;
          border-radius:9px;
          background:white;
          color:#334155;
          font-weight:700;
          cursor:pointer;
        }

        .theme-refresh:disabled,
        .theme-save:disabled {
          opacity:.55;
          cursor:not-allowed;
        }

        .theme-message {
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:12px;
          padding:13px 16px;
          border-radius:10px;
          margin-bottom:20px;
          font-size:13px;
          font-weight:600;
        }

        .theme-message.success {
          background:#ecfdf5;
          color:#047857;
          border:1px solid #a7f3d0;
        }

        .theme-message.error {
          background:#fef2f2;
          color:#b91c1c;
          border:1px solid #fecaca;
        }

        .theme-message.info {
          background:#eff6ff;
          color:#1d4ed8;
          border:1px solid #bfdbfe;
        }

        .theme-message button {
          border:0;
          background:transparent;
          color:inherit;
          font-size:20px;
          cursor:pointer;
        }

        .theme-active-banner {
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:14px;
          padding:17px 19px;
          margin-bottom:22px;
          border:1px solid #bbf7d0;
          border-radius:12px;
          background:#f0fdf4;
        }

        .theme-active-banner strong {
          display:block;
          color:#166534;
          font-size:14px;
        }

        .theme-active-banner span {
          display:block;
          color:#15803d;
          font-size:11px;
          margin-top:5px;
        }

        .theme-active-dot {
          width:10px;
          height:10px;
          border-radius:50%;
          background:#22c55e;
        }

        .theme-editor-grid {
          display:grid;
          grid-template-columns:minmax(0,1fr) minmax(0,.9fr);
          gap:22px;
          align-items:start;
        }

        .theme-panel {
          background:white;
          border:1px solid #e5eaf1;
          border-radius:14px;
          padding:23px;
          min-width:0;
          box-shadow:0 2px 8px rgba(15,23,42,.025);
        }

        .theme-panel-heading h2 {
          font-size:18px;
          margin:0;
          font-weight:800;
        }

        .theme-panel-subtitle {
          color:#64748b;
          font-size:12px;
          line-height:1.6;
          margin:6px 0 20px;
        }

        .theme-label {
          display:block;
          font-size:12px;
          font-weight:700;
          color:#334155;
          margin:16px 0 8px;
        }

        .theme-input,
        .theme-select {
          width:100%;
          min-height:43px;
          padding:10px 12px;
          border:1px solid #dbe2ea;
          border-radius:8px;
          color:#172033;
          background:white;
          font-size:13px;
          outline:none;
        }

        .theme-input:focus,
        .theme-select:focus {
          border-color:#2563eb;
          box-shadow:0 0 0 3px #dbeafe;
        }

        .theme-preset-grid {
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:10px;
        }

        .theme-preset {
          text-align:left;
          padding:13px;
          border:1px solid #e2e8f0;
          background:#fff;
          border-radius:10px;
          cursor:pointer;
          transition:.18s;
        }

        .theme-preset:hover {
          border-color:#93c5fd;
          transform:translateY(-1px);
        }

        .theme-preset.selected {
          border:2px solid #2563eb;
          background:#eff6ff;
          padding:12px;
        }

        .theme-preset strong {
          display:block;
          font-size:13px;
          color:#172033;
        }

        .theme-preset span {
          display:block;
          font-size:11px;
          color:#64748b;
          margin-top:4px;
        }

        .theme-section-divider {
          height:1px;
          background:#edf0f4;
          margin:23px 0;
        }

        .theme-section-title {
          font-size:15px;
          font-weight:800;
          margin:0;
        }

        .theme-section-description {
          font-size:11px;
          color:#64748b;
          margin:5px 0 14px;
          line-height:1.6;
        }

        .theme-color-grid {
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:10px;
        }

        .theme-color-card {
          border:1px solid #e5eaf1;
          border-radius:10px;
          padding:12px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:8px;
        }

        .theme-color-card strong {
          display:block;
          font-size:12px;
        }

        .theme-color-card span {
          display:block;
          font-size:10px;
          color:#94a3b8;
          margin-top:3px;
        }

        .theme-color-picker {
          width:39px;
          height:35px;
          border:0;
          padding:0;
          background:transparent;
          cursor:pointer;
        }

        .theme-option-grid {
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:9px;
        }

        .theme-option {
          padding:12px 10px;
          border:1px solid #e2e8f0;
          border-radius:9px;
          background:white;
          color:#334155;
          text-align:left;
          cursor:pointer;
        }

        .theme-option strong {
          display:block;
          font-size:12px;
        }

        .theme-option span {
          display:block;
          font-size:10px;
          color:#94a3b8;
          margin-top:4px;
        }

        .theme-option.selected {
          border:2px solid #2563eb;
          background:#eff6ff;
          padding:11px 9px;
          color:#1d4ed8;
        }

        .theme-font-sample {
          padding:18px;
          border:1px solid #e5eaf1;
          border-radius:10px;
          background:#f8fafc;
          margin-top:15px;
        }

        .theme-font-sample .sample-heading {
          display:block;
          margin-bottom:10px;
          font-size:25px;
        }

        .theme-font-sample .sample-body {
          display:block;
          font-size:14px;
          margin-top:8px;
        }

        .theme-font-sample small {
          display:block;
          color:#64748b;
          font-size:10px;
          margin-top:12px;
        }

        .theme-subsection {
          border:1px solid #e5eaf1;
          border-radius:10px;
          padding:14px;
          margin-top:15px;
          background:#fff;
        }

        .theme-subsection h4 {
          margin:0;
          font-size:13px;
          font-weight:800;
          color:#1e293b;
        }

        .theme-subsection p {
          margin:5px 0 12px;
          font-size:11px;
          color:#64748b;
        }

        .theme-two-column {
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:0 12px;
        }

        .theme-editor-actions {
          display:flex;
          gap:10px;
          margin-top:25px;
        }

        .theme-save {
          flex:1;
          min-height:46px;
          border:0;
          border-radius:9px;
          background:#2563eb;
          color:white;
          font-weight:800;
          cursor:pointer;
        }

        .theme-save:hover { background:#1d4ed8; }

        .theme-reset {
          padding:0 16px;
          border:1px solid #dbe2ea;
          border-radius:9px;
          background:white;
          color:#475569;
          font-weight:700;
          cursor:pointer;
        }

        .theme-preview-frame {
          width:100%;
          height:760px;
          overflow:hidden;
          border:1px solid #e2e8f0;
          border-radius:12px;
          background:#fff;
          position:relative;
        }

        .theme-preview-frame iframe {
          width:100%;
          height:100%;
          border:0;
          display:block;
          background:#fff;
        }

        .theme-preview-note {
          font-size:11px;
          color:#64748b;
          line-height:1.6;
          margin-top:13px;
        }

        .theme-saved-section { margin-top:32px; }

        .theme-saved-heading {
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:12px;
        }

        .theme-saved-heading h2 {
          font-size:19px;
          margin:0;
        }

        .theme-saved-heading p {
          font-size:12px;
          color:#64748b;
          margin:5px 0 0;
        }

        .theme-list-section {
          padding:18px;
          margin-top:13px;
          border:1px solid #e5eaf1;
          border-radius:12px;
          background:white;
        }

        .theme-list-row {
          display:flex;
          justify-content:space-between;
          align-items:center;
          flex-wrap:wrap;
          gap:12px;
          padding:14px 0;
        }

        .theme-list-info {
          display:flex;
          align-items:center;
          gap:11px;
        }

        .theme-color-dot {
          width:30px;
          height:30px;
          border-radius:9px;
          border:1px solid #e2e8f0;
        }

        .theme-list-info strong {
          display:block;
          font-size:13px;
        }

        .theme-list-info span {
          display:block;
          color:#64748b;
          font-size:10px;
          margin-top:4px;
          text-transform:capitalize;
        }

        .active-theme-label {
          display:flex;
          align-items:center;
          gap:6px;
          color:#15803d;
          font-size:11px;
          font-weight:800;
        }

        .active-theme-label span {
          width:7px;
          height:7px;
          border-radius:50%;
          background:#22c55e;
        }

        .empty-state {
          text-align:center;
          padding:22px 10px;
          color:#94a3b8;
          font-size:12px;
        }

        .empty-icon { font-size:25px; }
        .empty-state p { margin:6px 0 0; }

        @media(max-width:1050px) {
          .theme-editor-grid { grid-template-columns:1fr; }
          .theme-preview-frame { height:650px; }
        }

        @media(max-width:640px) {
          .theme-customizer-page { padding:20px 12px 40px; }
          .theme-page-header h1 { font-size:22px; }
          .theme-panel { padding:16px; }
          .theme-preset-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
          .theme-color-grid { gap:7px; }
          .theme-editor-actions { flex-direction:column; }
          .theme-reset { min-height:42px; }
          .theme-preview-frame { height:550px; }
          .theme-two-column { grid-template-columns:1fr; }
        }
      `}</style>

      <header className="theme-page-header">
        <div>
          <span className="theme-eyebrow">
            Storefront Design Studio
          </span>

          <h1>Theme Customizer</h1>

          <p>
            Design, preview and publish your ecommerce storefront theme.
          </p>
        </div>

        <button
          type="button"
          className="theme-refresh"
          onClick={() => void loadThemes()}
          disabled={loading || saving || restoringId !== null}
        >
          {loading ? "Refreshing..." : "↻ Refresh"}
        </button>
      </header>

      {message && (
        <div
          className={`theme-message ${messageType}`}
          role="status"
        >
          <span>{message}</span>

          <button
            type="button"
            onClick={() => setMessage("")}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

      {activeTheme && (
        <div className="theme-active-banner">
          <div>
            <strong>
              Currently Published: {activeTheme.name}
            </strong>

            <span>
              {activeTheme.preset} ·{" "}
              {activeTheme.settings.typography.fontFamily}
            </span>
          </div>

          <div className="theme-active-dot" />
        </div>
      )}

      <div className="theme-editor-grid">
        <section className="theme-panel">
          <div className="theme-panel-heading">
            <h2>Design Settings</h2>
          </div>

          <p className="theme-panel-subtitle">
            Choose a preset and customize your storefront appearance.
          </p>

          <label className="theme-label" htmlFor="theme-name">
            Theme name
          </label>

          <input
            id="theme-name"
            className="theme-input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={80}
            placeholder="Enter your theme name"
          />

          <label className="theme-label">
            Choose a design preset
          </label>

          <div className="theme-preset-grid">
            {presets.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={preset === item.id}
                className={`theme-preset ${
                  preset === item.id ? "selected" : ""
                }`}
                onClick={() => handlePresetChange(item.id)}
              >
                <strong>{item.label}</strong>
                <span>{item.description}</span>
              </button>
            ))}
          </div>

          <div className="theme-section-divider" />

          <h3 className="theme-section-title">Color Palette</h3>

          <p className="theme-section-description">
            Change colors without changing your selected preset.
          </p>

          <div className="theme-color-grid">
            {colorFields.map((field) => (
              <div className="theme-color-card" key={field.key}>
                <div>
                  <strong>{field.label}</strong>
                  <span>{field.description}</span>
                  <span>
                    {settings.colors[field.key].toUpperCase()}
                  </span>
                </div>

                <input
                  className="theme-color-picker"
                  type="color"
                  aria-label={`${field.label} color`}
                  value={settings.colors[field.key]}
                  onChange={(event) =>
                    updateColor(field.key, event.target.value)
                  }
                />
              </div>
            ))}
          </div>

          <div className="theme-section-divider" />

          <h3 className="theme-section-title">Navbar Colors</h3>

          <p className="theme-section-description">
            Customize your navigation bar independently.
          </p>

          <div className="theme-color-grid">
            {navbarColorFields.map((field) => (
              <div className="theme-color-card" key={field.key}>
                <div>
                  <strong>{field.label}</strong>
                  <span>{field.description}</span>
                  <span>
                    {settings.navbar[field.key].toUpperCase()}
                  </span>
                </div>

                <input
                  className="theme-color-picker"
                  type="color"
                  aria-label={field.label}
                  value={settings.navbar[field.key]}
                  onChange={(event) =>
                    updateNavbarColor(field.key, event.target.value)
                  }
                />
              </div>
            ))}
          </div>

          <div className="theme-section-divider" />

          <h3 className="theme-section-title">Footer Colors</h3>

          <p className="theme-section-description">
            Customize your footer independently.
          </p>

          <div className="theme-color-grid">
            {footerColorFields.map((field) => (
              <div className="theme-color-card" key={field.key}>
                <div>
                  <strong>{field.label}</strong>
                  <span>{field.description}</span>
                  <span>
                    {settings.footer[field.key].toUpperCase()}
                  </span>
                </div>

                <input
                  className="theme-color-picker"
                  type="color"
                  aria-label={field.label}
                  value={settings.footer[field.key]}
                  onChange={(event) =>
                    updateFooterColor(field.key, event.target.value)
                  }
                />
              </div>
            ))}
          </div>

          <div className="theme-section-divider" />

          {/* Advanced Typography */}
          <h3 className="theme-section-title">
            Advanced Typography
          </h3>

          <p className="theme-section-description">
            Customize body text and heading styles independently.
          </p>

          <div className="theme-subsection">
            <h4>Body Text Styles</h4>
            <p>These settings control the main storefront text appearance.</p>

            <label className="theme-label" htmlFor="font-family">
              Font family
            </label>

            <select
              id="font-family"
              className="theme-select"
              value={typography.fontFamily}
              onChange={(event) =>
                updateSettings("typography", "fontFamily", event.target.value)
              }
            >
              {fontOptions.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>

            <div className="theme-two-column">
              <div>
                <label className="theme-label" htmlFor="base-font-size">
                  Font size
                </label>

                <select
                  id="base-font-size"
                  className="theme-select"
                  value={typography.baseFontSize}
                  onChange={(event) =>
                    updateSettings(
                      "typography",
                      "baseFontSize",
                      event.target.value
                    )
                  }
                >
                  {["12px", "13px", "14px", "15px", "16px", "17px", "18px", "20px"].map(
                    (size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="theme-label" htmlFor="body-font-weight">
                  Font weight
                </label>

                <select
                  id="body-font-weight"
                  className="theme-select"
                  value={typography.fontWeight}
                  onChange={(event) =>
                    updateSettings(
                      "typography",
                      "fontWeight",
                      event.target.value
                    )
                  }
                >
                  <option value="300">Light</option>
                  <option value="400">Normal</option>
                  <option value="500">Medium</option>
                  <option value="600">Semi-bold</option>
                  <option value="700">Bold</option>
                  <option value="800">Extra bold</option>
                </select>
              </div>
            </div>

            <div className="theme-two-column">
              <div>
                <label className="theme-label" htmlFor="body-font-style">
                  Font style
                </label>

                <select
                  id="body-font-style"
                  className="theme-select"
                  value={typography.fontStyle}
                  onChange={(event) =>
                    updateSettings(
                      "typography",
                      "fontStyle",
                      event.target.value
                    )
                  }
                >
                  <option value="normal">Normal</option>
                  <option value="italic">Italic</option>
                </select>
              </div>

              <div>
                <label className="theme-label" htmlFor="body-transform">
                  Text transform
                </label>

                <select
                  id="body-transform"
                  className="theme-select"
                  value={typography.textTransform}
                  onChange={(event) =>
                    updateSettings(
                      "typography",
                      "textTransform",
                      event.target.value
                    )
                  }
                >
                  <option value="none">Default</option>
                  <option value="uppercase">UPPERCASE</option>
                  <option value="lowercase">lowercase</option>
                  <option value="capitalize">Capitalize</option>
                </select>
              </div>
            </div>

            <div className="theme-two-column">
              <div>
                <label className="theme-label" htmlFor="body-decoration">
                  Text decoration
                </label>

                <select
                  id="body-decoration"
                  className="theme-select"
                  value={typography.textDecoration}
                  onChange={(event) =>
                    updateSettings(
                      "typography",
                      "textDecoration",
                      event.target.value
                    )
                  }
                >
                  <option value="none">None</option>
                  <option value="underline">Underline</option>
                  <option value="line-through">Line-through</option>
                </select>
              </div>

              <div>
                <label className="theme-label" htmlFor="body-letter-spacing">
                  Letter spacing
                </label>

                <select
                  id="body-letter-spacing"
                  className="theme-select"
                  value={typography.letterSpacing}
                  onChange={(event) =>
                    updateSettings(
                      "typography",
                      "letterSpacing",
                      event.target.value
                    )
                  }
                >
                  <option value="-0.5px">Tight</option>
                  <option value="0px">Normal</option>
                  <option value="0.5px">Wide</option>
                  <option value="1px">Wider</option>
                  <option value="2px">Extra wide</option>
                </select>
              </div>
            </div>

            <label className="theme-label" htmlFor="body-line-height">
              Line height
            </label>

            <select
              id="body-line-height"
              className="theme-select"
              value={typography.lineHeight}
              onChange={(event) =>
                updateSettings(
                  "typography",
                  "lineHeight",
                  event.target.value
                )
              }
            >
              <option value="1.2">Compact · 1.2</option>
              <option value="1.4">Normal · 1.4</option>
              <option value="1.6">Comfortable · 1.6</option>
              <option value="1.8">Relaxed · 1.8</option>
              <option value="2">Wide · 2.0</option>
            </select>
          </div>

          <div className="theme-subsection">
            <h4>Heading Styles</h4>
            <p>Set separate typography for headings and titles.</p>

            <label className="theme-label" htmlFor="heading-font-family">
              Heading font family
            </label>

            <select
              id="heading-font-family"
              className="theme-select"
              value={typography.headingFontFamily}
              onChange={(event) =>
                updateSettings(
                  "typography",
                  "headingFontFamily",
                  event.target.value
                )
              }
            >
              {fontOptions.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>

            <div className="theme-two-column">
              <div>
                <label className="theme-label" htmlFor="heading-weight">
                  Heading weight
                </label>

                <select
                  id="heading-weight"
                  className="theme-select"
                  value={typography.headingWeight}
                  onChange={(event) =>
                    updateSettings(
                      "typography",
                      "headingWeight",
                      event.target.value
                    )
                  }
                >
                  <option value="400">Normal</option>
                  <option value="500">Medium</option>
                  <option value="600">Semi-bold</option>
                  <option value="700">Bold</option>
                  <option value="800">Extra bold</option>
                  <option value="900">Black</option>
                </select>
              </div>

              <div>
                <label className="theme-label" htmlFor="heading-font-style">
                  Heading font style
                </label>

                <select
                  id="heading-font-style"
                  className="theme-select"
                  value={typography.headingFontStyle}
                  onChange={(event) =>
                    updateSettings(
                      "typography",
                      "headingFontStyle",
                      event.target.value
                    )
                  }
                >
                  <option value="normal">Normal</option>
                  <option value="italic">Italic</option>
                </select>
              </div>
            </div>

            <div className="theme-two-column">
              <div>
                <label className="theme-label" htmlFor="heading-transform">
                  Heading transform
                </label>

                <select
                  id="heading-transform"
                  className="theme-select"
                  value={typography.headingTextTransform}
                  onChange={(event) =>
                    updateSettings(
                      "typography",
                      "headingTextTransform",
                      event.target.value
                    )
                  }
                >
                  <option value="none">Default</option>
                  <option value="uppercase">UPPERCASE</option>
                  <option value="lowercase">lowercase</option>
                  <option value="capitalize">Capitalize</option>
                </select>
              </div>

              <div>
                <label className="theme-label" htmlFor="heading-spacing">
                  Heading letter spacing
                </label>

                <select
                  id="heading-spacing"
                  className="theme-select"
                  value={typography.headingLetterSpacing}
                  onChange={(event) =>
                    updateSettings(
                      "typography",
                      "headingLetterSpacing",
                      event.target.value
                    )
                  }
                >
                  <option value="-1px">Tight</option>
                  <option value="0px">Normal</option>
                  <option value="0.3px">Subtle</option>
                  <option value="1px">Wide</option>
                  <option value="2px">Extra wide</option>
                </select>
              </div>
            </div>
          </div>

          {/* Live Typography Sample */}
          <div className="theme-font-sample">
            <strong
              className="sample-heading"
              style={{
                fontFamily: `"${typography.headingFontFamily}", sans-serif`,
                fontWeight: Number(typography.headingWeight),
                fontStyle: typography.headingFontStyle as "normal" | "italic",
                textTransform: typography.headingTextTransform as
                  | "none"
                  | "uppercase"
                  | "lowercase"
                  | "capitalize",
                letterSpacing: typography.headingLetterSpacing,
              }}
            >
              Beautiful Storefront
            </strong>

            <span
              className="sample-body"
              style={{
                fontFamily: `"${typography.fontFamily}", sans-serif`,
                fontSize: typography.baseFontSize,
                fontWeight: Number(typography.fontWeight),
                fontStyle: typography.fontStyle as "normal" | "italic",
                textTransform: typography.textTransform as
                  | "none"
                  | "uppercase"
                  | "lowercase"
                  | "capitalize",
                textDecoration: typography.textDecoration as
                  | "none"
                  | "underline"
                  | "line-through",
                letterSpacing: typography.letterSpacing,
                lineHeight: Number(typography.lineHeight),
              }}
            >
              Discover our latest collection and explore products designed
              for your everyday lifestyle.
            </span>

            <small>
              Body: {typography.fontFamily} · {typography.baseFontSize} ·{" "}
              {typography.fontWeight}
              <br />
              Heading: {typography.headingFontFamily} ·{" "}
              {typography.headingWeight}
            </small>
          </div>

          <div className="theme-section-divider" />

          {/* Buttons Customization */}
          <h3 className="theme-section-title">
            Buttons Customization
          </h3>

          <p className="theme-section-description">
            Customize button shape, padding and font weight.
          </p>

          <div className="theme-option-grid">
            {buttonOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={
                  settings.buttons.borderRadius === option.value
                }
                className={`theme-option ${
                  settings.buttons.borderRadius === option.value
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  updateSettings("buttons", "borderRadius", option.value)
                }
              >
                <strong>{option.label}</strong>
                <span>{option.value} radius</span>
              </button>
            ))}
          </div>

          <label className="theme-label" htmlFor="button-padding">
            Button padding
          </label>

          <select
            id="button-padding"
            className="theme-select"
            value={settings.buttons.padding}
            onChange={(event) =>
              updateSettings("buttons", "padding", event.target.value)
            }
          >
            <option value="9px 16px">Small</option>
            <option value="12px 20px">Medium</option>
            <option value="14px 26px">Large</option>
            <option value="16px 32px">Extra large</option>
          </select>

          <label className="theme-label" htmlFor="button-weight">
            Button font weight
          </label>

          <select
            id="button-weight"
            className="theme-select"
            value={settings.buttons.fontWeight}
            onChange={(event) =>
              updateSettings("buttons", "fontWeight", event.target.value)
            }
          >
            <option value="500">Medium</option>
            <option value="600">Semi-bold</option>
            <option value="700">Bold</option>
            <option value="800">Extra bold</option>
          </select>

          <div className="theme-section-divider" />

          {/* Borders Customization */}
          <h3 className="theme-section-title">
            Borders Customization
          </h3>

          <p className="theme-section-description">
            Control border thickness, style, color and corner radius.
          </p>

          <label className="theme-label" htmlFor="border-width">
            Border width
          </label>

          <select
            id="border-width"
            className="theme-select"
            value={settings.borders.width}
            onChange={(event) =>
              updateSettings("borders", "width", event.target.value)
            }
          >
            <option value="0px">None</option>
            <option value="1px">Thin</option>
            <option value="2px">Medium</option>
            <option value="3px">Thick</option>
          </select>

          <label className="theme-label" htmlFor="border-style">
            Border style
          </label>

          <select
            id="border-style"
            className="theme-select"
            value={settings.borders.style}
            onChange={(event) =>
              updateSettings("borders", "style", event.target.value)
            }
          >
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
          </select>

          <label className="theme-label" htmlFor="border-radius">
            Border radius
          </label>

          <select
            id="border-radius"
            className="theme-select"
            value={settings.borders.radius}
            onChange={(event) =>
              updateSettings("borders", "radius", event.target.value)
            }
          >
            <option value="0px">Square</option>
            <option value="4px">Subtle</option>
            <option value="8px">Rounded</option>
            <option value="14px">Soft</option>
            <option value="20px">Extra rounded</option>
          </select>

          <label className="theme-label" htmlFor="border-color">
            Border color
          </label>

          <div className="theme-color-card">
            <div>
              <strong>{settings.borders.color.toUpperCase()}</strong>
              <span>Storefront border color</span>
            </div>

            <input
              id="border-color"
              className="theme-color-picker"
              type="color"
              value={settings.borders.color}
              onChange={(event) =>
                updateSettings("borders", "color", event.target.value)
              }
            />
          </div>

          <div className="theme-section-divider" />

          {/* Layout Spacing */}
          <h3 className="theme-section-title">
            Layout Spacing
          </h3>

          <p className="theme-section-description">
            Adjust the space between storefront elements.
          </p>

          <div className="theme-option-grid">
            {spacingOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={
                  settings.spacing.scale === option.value
                }
                className={`theme-option ${
                  settings.spacing.scale === option.value
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  updateSettings("spacing", "scale", option.value)
                }
              >
                <strong>{option.label}</strong>
                <span>{option.description}</span>
              </button>
            ))}
          </div>

          <label className="theme-label" htmlFor="section-gap">
            Section spacing
          </label>

          <select
            id="section-gap"
            className="theme-select"
            value={settings.spacing.sectionGap}
            onChange={(event) =>
              updateSettings("spacing", "sectionGap", event.target.value)
            }
          >
            <option value="24px">Tight · 24px</option>
            <option value="36px">Balanced · 36px</option>
            <option value="48px">Relaxed · 48px</option>
            <option value="64px">Wide · 64px</option>
          </select>

          <div className="theme-editor-actions">
            <button
              type="button"
              className="theme-save"
              onClick={() => void saveAndPublishTheme()}
              disabled={saving || loading || restoringId !== null}
            >
              {saving ? "Publishing Theme..." : "Publish Theme"}
            </button>

            <button
              type="button"
              className="theme-reset"
              onClick={resetSettings}
              disabled={saving || restoringId !== null}
            >
              Reset
            </button>
          </div>
        </section>

        {/* Live Storefront Preview */}
        <section className="theme-panel">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <div className="theme-panel-heading">
              <h2>Live Storefront Preview</h2>
            </div>

            <button
              type="button"
              className="theme-refresh"
              onClick={reloadStorefrontPreview}
            >
              ↻ Reload Preview
            </button>
          </div>

          <p className="theme-panel-subtitle">
            Your actual Maison Medusa storefront appears below.
            Draft design changes are temporary until published.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
              fontSize: "12px",
              fontWeight: 700,
              color: previewReady ? "#15803d" : "#d97706",
            }}
          >
            <span
              style={{
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                background: previewReady ? "#22c55e" : "#f59e0b",
              }}
            />

            {previewReady
              ? "Live Preview Connected"
              : "Connecting to Storefront..."}
          </div>

          <div className="theme-preview-frame">
            <iframe
              key={previewReloadKey}
              ref={previewFrameRef}
              src={STOREFRONT_PREVIEW_URL}
              title="Maison Medusa Live Storefront Preview"
              onLoad={() => setPreviewReady(false)}
              allow="clipboard-read; clipboard-write"
            />
          </div>

          <p className="theme-preview-note">
            The preview uses your actual storefront. Make sure
            the storefront ThemeProvider supports preview messages.
          </p>

          <a
            href={STOREFRONT_PREVIEW_URL}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              marginTop: "10px",
              color: "#2563eb",
              fontSize: "12px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Open Storefront in New Tab ↗
          </a>
        </section>
      </div>

      {/* Published Theme */}
      <section className="theme-saved-section">
        <div className="theme-saved-heading">
          <div>
            <h2>Published Theme</h2>
            <p>
              The theme currently applied to your storefront.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            Loading published theme...
          </div>
        ) : publishedThemes.length === 0 ? (
          <div className="theme-list-section empty-state">
            <span className="empty-icon">◇</span>
            <p>
              No published theme found. Create and publish your first theme.
            </p>
          </div>
        ) : (
          publishedThemes.map((theme) => (
            <div className="theme-list-section" key={theme.id}>
              <div className="theme-list-row">
                <div className="theme-list-info">
                  <div
                    className="theme-color-dot"
                    style={{
                      background: theme.settings.colors.primary,
                    }}
                  />

                  <div>
                    <strong>{theme.name}</strong>
                    <span>
                      {theme.preset} ·{" "}
                      {theme.settings.typography.fontFamily}
                    </span>
                  </div>
                </div>

                <span className="active-theme-label">
                  <span /> Active
                </span>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Archived Themes */}
      <section className="theme-saved-section">
        <div className="theme-saved-heading">
          <div>
            <h2>Archived Themes</h2>
            <p>
              Restore a previous theme to make it the active storefront theme.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            Loading archived themes...
          </div>
        ) : archivedThemes.length === 0 ? (
          <div className="theme-list-section empty-state">
            <span className="empty-icon">↺</span>
            <p>
              No archived themes available yet. Previously published themes will appear here.
            </p>
          </div>
        ) : (
          archivedThemes.map((theme) => (
            <div className="theme-list-section" key={theme.id}>
              <div className="theme-list-row">
                <div className="theme-list-info">
                  <div
                    className="theme-color-dot"
                    style={{
                      background: theme.settings.colors.primary,
                    }}
                  />

                  <div>
                    <strong>{theme.name}</strong>
                    <span>
                      {theme.preset} ·{" "}
                      {theme.settings.typography.fontFamily}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="theme-refresh"
                  onClick={() => void restoreTheme(theme)}
                  disabled={
                    saving ||
                    loading ||
                    restoringId !== null
                  }
                >
                  {restoringId === theme.id
                    ? "Restoring..."
                    : "↺ Restore Theme"}
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Storefront Themes",
})

export default StorefrontThemesPage