
import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

import { PRODUCT_DISPLAY_TEMPLATE_MODULE } from "../../../modules/product-display-template"
import ProductDisplayTemplateModuleService from "../../../modules/product-display-template/service"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const service =
      req.scope.resolve<ProductDisplayTemplateModuleService>(
        PRODUCT_DISPLAY_TEMPLATE_MODULE
      )

    const templates =
      await service.listProductDisplayTemplates({})

    const selectedTemplate =
      templates.length > 0
        ? templates[templates.length - 1].template
        : "classic-grid"

    return res.status(200).json({ selectedTemplate })
  } catch (error) {
    console.error("Failed to load storefront template:", error)

    return res.status(500).json({
      message: "Failed to load storefront template",
    })
  }
}
