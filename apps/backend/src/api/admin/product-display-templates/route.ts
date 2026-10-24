
import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

const VALID_TEMPLATES = [
  "classic-grid",
  "premium-card",
  "list-view",
  "image-focused",
] as const

type ProductTemplate = (typeof VALID_TEMPLATES)[number]

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const service = req.scope.resolve("productDisplayTemplate") as any

    const templates = await service.listProductDisplayTemplates(
      {},
      { take: 1, order: { created_at: "DESC" } }
    )

    return res.status(200).json({
      selectedTemplate:
        templates?.[0]?.template ?? "classic-grid",
    })
  } catch (error) {
    console.error("Failed to get product template:", error)
    return res.status(500).json({
      message: "Failed to load product template",
    })
  }
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const body = req.body as { template?: string }
    const template = body?.template

    if (
      !template ||
      !VALID_TEMPLATES.includes(template as ProductTemplate)
    ) {
      return res.status(400).json({
        message: "Invalid product display template",
      })
    }

    const service = req.scope.resolve("productDisplayTemplate") as any

    const saved = await service.createProductDisplayTemplates({
      template,
    })

    return res.status(200).json({
      selectedTemplate: saved.template,
      message: "Template saved successfully",
    })
  } catch (error) {
    console.error("Failed to save product template:", error)
    return res.status(500).json({
      message: "Failed to save product template",
    })
  }
}
