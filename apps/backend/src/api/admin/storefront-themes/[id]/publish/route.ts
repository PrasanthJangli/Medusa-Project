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

    const selectedTheme = themes.find((theme) => theme.id === id)

    if (!selectedTheme) {
      return res.status(404).json({
        message: "Theme not found",
      })
    }

    const currentTheme = themes.find(
      (theme) => theme.status === "published"
    )

    if (currentTheme && currentTheme.id !== id) {
      await themeService.updateStorefrontThemes({
        id: currentTheme.id,
        status: "archived",
      })
    }

    const publishedTheme = await themeService.updateStorefrontThemes({
      id,
      status: "published",
    })

    return res.json({
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