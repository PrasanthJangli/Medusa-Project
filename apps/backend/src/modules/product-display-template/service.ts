
import { MedusaService } from "@medusajs/framework/utils"
import ProductDisplayTemplate from "./models/product-display-template"

class ProductDisplayTemplateModuleService extends MedusaService({
  ProductDisplayTemplate,
}) {}

export default ProductDisplayTemplateModuleService
