import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { STOREFRONT_THEME_MODULE } from "../../../modules/storefront-theme"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const themeService = req.scope.resolve(STOREFRONT_THEME_MODULE)

    const themes = await themeService.listStorefrontThemes()

    // Get all published themes
    const publishedThemes = themes.filter(
      (theme) => theme.status === "published"
    )

    if (publishedThemes.length === 0) {
      return res.status(200).json({
        theme: null,
        message: "No published theme found",
      })
    }

    // Select the most recently updated published theme
    const latestPublishedTheme = publishedThemes.sort((a, b) => {
      const dateA = new Date(
        a.updated_at ?? a.created_at ?? 0
      ).getTime()

      const dateB = new Date(
        b.updated_at ?? b.created_at ?? 0
      ).getTime()

      return dateB - dateA
    })[0]

    console.log("Active storefront theme:", {
      name: latestPublishedTheme.name,
      preset: latestPublishedTheme.preset,
      status: latestPublishedTheme.status,
    })

    return res.status(200).json({
      theme: {
        id: latestPublishedTheme.id,
        name: latestPublishedTheme.name,
        preset: latestPublishedTheme.preset,
        settings: latestPublishedTheme.settings,
      },
    })
  } catch (error) {
    console.error("Get published theme error:", error)

    return res.status(500).json({
      message: "Unable to fetch published theme",
    })
  }
}