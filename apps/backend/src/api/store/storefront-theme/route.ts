import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { STOREFRONT_THEME_MODULE } from "../../../modules/storefront-theme"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const themeService = req.scope.resolve(STOREFRONT_THEME_MODULE)

    const themes = await themeService.listStorefrontThemes()

    const publishedTheme = themes.find(
      (theme) => theme.status === "published"
    )

    if (!publishedTheme) {
      return res.status(200).json({
        theme: null,
        message: "No published theme found",
      })
    }

    return res.status(200).json({
      theme: {
        name: publishedTheme.name,
        preset: publishedTheme.preset,
        settings: publishedTheme.settings,
      },
    })
  } catch (error) {
    console.error("Get published theme error:", error)

    return res.status(500).json({
      message: "Unable to fetch published theme",
    })
  }
}