
import { Module } from "@medusajs/framework/utils"
import ProductDisplayTemplateModuleService from "./service"

export const PRODUCT_DISPLAY_TEMPLATE_MODULE =
  "productDisplayTemplate"

export default Module(
  PRODUCT_DISPLAY_TEMPLATE_MODULE,
  {
    service: ProductDisplayTemplateModuleService,
  }
)
