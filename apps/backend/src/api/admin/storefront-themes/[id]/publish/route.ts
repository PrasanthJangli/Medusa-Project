
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { STOREFRONT_THEME_MODULE } from "../../../../../modules/storefront-theme"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const themeService = req.scope.resolve(STOREFRONT_THEME_MODULE)
    const { id } = req.params

    const themes = await themeService.listStorefrontThemes()

    const selectedTheme = themes.find(
      (theme) => theme.id === id
    )

    if (!selectedTheme) {
      return res.status(404).json({
        message: "Theme not found",
      })
    }

    // Archive other published themes.
    const otherPublishedThemes = themes.filter(
      (theme) =>
        theme.status === "published" &&
        theme.id !== id
    )

    for (const theme of otherPublishedThemes) {
      await themeService.updateStorefrontThemes({
        id: theme.id,
        status: "archived",
      })
    }

    // Publish selected theme.
    const publishedTheme =
      await themeService.updateStorefrontThemes({
        id,
        status: "published",
      })

    console.log("Storefront theme published:", {
      id: publishedTheme.id,
      name: publishedTheme.name,
      preset: publishedTheme.preset,
      status: publishedTheme.status,
      settings: publishedTheme.settings,
    })

    return res.status(200).json({
      message: "Theme published successfully!",
      theme: publishedTheme,
    })
  } catch (error) {
    console.error("Publish theme error:", error)

    return res.status(500).json({
      message: "Unable to publish theme",
    })
  }
}
