import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { STOREFRONT_THEME_MODULE } from "../../../modules/storefront-theme"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const themeService = req.scope.resolve(STOREFRONT_THEME_MODULE)

  const themes = await themeService.listStorefrontThemes()

  res.json({ themes })
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const themeService = req.scope.resolve(STOREFRONT_THEME_MODULE)

  const body = req.body as {
    name: string
    preset: "fashion" | "electronics" | "furniture" | "beauty" | "custom"
    settings: Record<string, unknown>
  }

  const theme = await themeService.createStorefrontThemes({
    name: body.name,
    preset: body.preset,
    settings: body.settings,
  })

  res.status(201).json({ theme })
}