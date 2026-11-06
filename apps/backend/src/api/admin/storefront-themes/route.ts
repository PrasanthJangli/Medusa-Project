
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { STOREFRONT_THEME_MODULE } from "../../../modules/storefront-theme"

type Preset =
  | "fashion"
  | "electronics"
  | "furniture"
  | "beauty"
  | "custom"

const statusPriority = {
  published: 3,
  draft: 2,
  archived: 1,
}

function removeDuplicateThemes(themes: any[]) {
  const uniqueThemes = new Map<string, any>()

  for (const theme of themes) {
    const key = `${theme.name.trim().toLowerCase()}-${theme.preset}`
    const existing = uniqueThemes.get(key)

    if (
      !existing ||
      statusPriority[theme.status as keyof typeof statusPriority] >
        statusPriority[existing.status as keyof typeof statusPriority]
    ) {
      uniqueThemes.set(key, theme)
    }
  }

  return Array.from(uniqueThemes.values())
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const themeService = req.scope.resolve(STOREFRONT_THEME_MODULE)

    const themes = await themeService.listStorefrontThemes()
    const uniqueThemes = removeDuplicateThemes(themes)

    return res.json({
      themes: uniqueThemes,
    })
  } catch (error) {
    console.error("Get storefront themes error:", error)

    return res.status(500).json({
      message: "Unable to load storefront themes",
    })
  }
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const themeService = req.scope.resolve(STOREFRONT_THEME_MODULE)

    const body = req.body as {
      name?: string
      preset?: Preset
      settings?: Record<string, unknown>
    }

    const name = body.name?.trim()
    const preset = body.preset
    const settings = body.settings

    const validPresets: Preset[] = [
      "fashion",
      "electronics",
      "furniture",
      "beauty",
      "custom",
    ]

    if (!name || !preset || !settings) {
      return res.status(400).json({
        message: "Theme name, preset and settings are required.",
      })
    }

    if (!validPresets.includes(preset)) {
      return res.status(400).json({
        message: "Invalid theme preset.",
      })
    }

    const existingThemes =
      await themeService.listStorefrontThemes()

    const existingTheme = existingThemes.find((theme: any) => {
      return (
        theme.name.trim().toLowerCase() === name.toLowerCase() &&
        theme.preset === preset
      )
    })

    // Update existing theme instead of creating a duplicate.
    if (existingTheme) {
      const updatedResult =
        await themeService.updateStorefrontThemes({
          id: existingTheme.id,
          name,
          preset,
          settings,
          status:
            existingTheme.status === "archived"
              ? "draft"
              : existingTheme.status,
        })

      const updatedTheme = Array.isArray(updatedResult)
        ? updatedResult[0]
        : updatedResult

      return res.status(200).json({
        message: "Existing theme updated successfully!",
        theme: updatedTheme,
      })
    }

    // Create only when the theme does not exist.
    const createdResult =
      await themeService.createStorefrontThemes({
        name,
        preset,
        settings,
      })

    const createdTheme = Array.isArray(createdResult)
      ? createdResult[0]
      : createdResult

    return res.status(201).json({
      message: "Theme created successfully!",
      theme: createdTheme,
    })
  } catch (error) {
    console.error("Save storefront theme error:", error)

    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Unable to save storefront theme",
    })
  }
}
