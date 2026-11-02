
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { useEffect, useState } from "react"

type Preset =
  | "fashion"
  | "electronics"
  | "furniture"
  | "beauty"
  | "custom"

type ThemeSettings = {
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
  }
  typography: {
    fontFamily: string
  }
  buttons: {
    borderRadius: string
  }
  spacing: {
    scale: string
  }
}

type Theme = {
  id: string
  name: string
  preset: Preset
  settings: ThemeSettings
  status: "draft" | "published" | "archived"
}

const presets: {
  id: Preset
  name: string
  description: string
}[] = [
  {
    id: "fashion",
    name: "Fashion",
    description: "Elegant shopping experience",
  },
  {
    id: "electronics",
    name: "Electronics",
    description: "Modern technology look",
  },
  {
    id: "furniture",
    name: "Furniture",
    description: "Warm and minimal design",
  },
  {
    id: "beauty",
    name: "Beauty",
    description: "Soft and premium appearance",
  },
  {
    id: "custom",
    name: "Custom",
    description: "Create your own design",
  },
]

const defaultSettings: ThemeSettings = {
  colors: {
    primary: "#2563EB",
    secondary: "#FACC15",
    background: "#FFFFFF",
    text: "#111827",
  },
  typography: {
    fontFamily: "Inter",
  },
  buttons: {
    borderRadius: "8px",
  },
  spacing: {
    scale: "medium",
  },
}

const StorefrontThemesPage = () => {
  const [themes, setThemes] = useState<Theme[]>([])
  const [name, setName] = useState("Fashion Theme")
  const [preset, setPreset] = useState<Preset>("fashion")
  const [settings, setSettings] =
    useState<ThemeSettings>(defaultSettings)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishingId, setPublishingId] = useState<string | null>(null)
  const [message, setMessage] = useState("")

  const loadThemes = async () => {
    try {
      const response = await fetch("/admin/storefront-themes", {
        headers: {
          Accept: "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to load themes")
      }

      setThemes(data.themes ?? [])
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not load themes."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadThemes()
  }, [])

  const updateColor = (
    key: keyof ThemeSettings["colors"],
    value: string
  ) => {
    setSettings((current) => ({
      ...current,
      colors: {
        ...current.colors,
        [key]: value,
      },
    }))
  }

  const saveTheme = async () => {
    if (!name.trim()) {
      setMessage("Please enter a theme name.")
      return
    }

    setSaving(true)
    setMessage("")

    try {
      const response = await fetch("/admin/storefront-themes", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          preset,
          settings,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create theme")
      }

      setMessage("Theme created successfully!")
      await loadThemes()
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to create theme."
      )
    } finally {
      setSaving(false)
    }
  }

  const publishTheme = async (themeId: string) => {
    setPublishingId(themeId)
    setMessage("")

    try {
      const response = await fetch(
        `/admin/storefront-themes/${themeId}/publish`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to publish theme")
      }

      setMessage("Theme published successfully!")
      await loadThemes()
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to publish theme."
      )
    } finally {
      setPublishingId(null)
    }
  }

  return (
    <div style={{ padding: 32, maxWidth: 1100 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>
        Storefront Theme Customizer
      </h1>

      <p style={{ marginTop: 8, marginBottom: 24 }}>
        Customize your storefront appearance and preview changes before publishing.
      </p>

      <h2 style={{ fontSize: 18, fontWeight: 600 }}>
        Theme name
      </h2>

      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Enter theme name"
        style={{
          padding: 10,
          width: "100%",
          maxWidth: 400,
          marginTop: 8,
          marginBottom: 24,
        }}
      />

      <h2 style={{ fontSize: 18, fontWeight: 600 }}>
        Choose a preset
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
          marginTop: 12,
        }}
      >
        {presets.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setPreset(item.id)}
            style={{
              padding: 16,
              textAlign: "left",
              borderRadius: 10,
              border:
                preset === item.id
                  ? "2px solid #2563EB"
                  : "1px solid #ddd",
              background:
                preset === item.id ? "#eff6ff" : "#fff",
              cursor: "pointer",
            }}
          >
            <strong>{item.name}</strong>
            <p style={{ marginTop: 6, fontSize: 13 }}>
              {item.description}
            </p>
          </button>
        ))}
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 28 }}>
        Customize colors
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
          marginTop: 12,
        }}
      >
        {(
          Object.keys(settings.colors) as
            (keyof ThemeSettings["colors"])[]
        ).map((key) => (
          <label key={key} style={{ display: "grid", gap: 6 }}>
            <span style={{ textTransform: "capitalize" }}>
              {key}
            </span>

            <input
              type="color"
              value={settings.colors[key]}
              onChange={(event) =>
                updateColor(key, event.target.value)
              }
            />
          </label>
        ))}
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 28 }}>
        Live preview
      </h2>

      <div
        style={{
          marginTop: 12,
          padding: 24,
          border: "1px solid #ddd",
          borderRadius: 12,
          background: settings.colors.background,
          color: settings.colors.text,
          fontFamily: settings.typography.fontFamily,
        }}
      >
        <h3 style={{ fontSize: 22, fontWeight: 700 }}>
          Your Storefront
        </h3>

        <p style={{ marginTop: 8 }}>
          Preview your selected theme here.
        </p>

        <button
          type="button"
          style={{
            marginTop: 16,
            padding: "10px 20px",
            background: settings.colors.primary,
            color: "#fff",
            border: "none",
            borderRadius: settings.buttons.borderRadius,
          }}
        >
          Shop Now
        </button>

        <span
          style={{
            display: "inline-block",
            marginLeft: 12,
            padding: 10,
            background: settings.colors.secondary,
            borderRadius: 6,
          }}
        >
          Secondary color
        </span>
      </div>

      <button
        type="button"
        onClick={saveTheme}
        disabled={saving}
        style={{
          marginTop: 24,
          padding: "12px 20px",
          background: "#2563EB",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: saving ? "wait" : "pointer",
          opacity: saving ? 0.7 : 1,
        }}
      >
        {saving ? "Saving..." : "Save Theme"}
      </button>

      {message && (
        <p role="status" style={{ marginTop: 12 }}>
          {message}
        </p>
      )}

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32 }}>
        Saved Themes
      </h2>

      {loading ? (
        <p>Loading themes...</p>
      ) : themes.length === 0 ? (
        <p>No themes created yet.</p>
      ) : (
        <div style={{ marginTop: 12 }}>
          {themes.map((theme) => (
            <div
              key={theme.id}
              style={{
                padding: 14,
                border: "1px solid #ddd",
                borderRadius: 8,
                marginBottom: 10,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <strong>{theme.name}</strong>

                <span style={{ marginLeft: 12 }}>
                  {theme.preset}
                </span>

                <span style={{ marginLeft: 12 }}>
                  Status: {theme.status}
                </span>
              </div>

              {theme.status === "published" ? (
                <span
                  style={{
                    color: "#15803d",
                    fontWeight: 600,
                  }}
                >
                  Published
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => publishTheme(theme.id)}
                  disabled={publishingId !== null}
                  style={{
                    padding: "8px 16px",
                    background: "#16A34A",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    cursor:
                      publishingId !== null
                        ? "wait"
                        : "pointer",
                    opacity:
                      publishingId !== null ? 0.7 : 1,
                  }}
                >
                  {publishingId === theme.id
                    ? "Publishing..."
                    : "Publish"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Storefront Themes",
})

export default StorefrontThemesPage
