
import { model } from "@medusajs/framework/utils"

const ProductDisplayTemplate = model.define(
  "product_display_template",
  {
    id: model.id().primaryKey(),
    template: model.enum([
      "classic-grid",
      "premium-card",
      "list-view",
      "image-focused",
    ]),
  }
)

export default ProductDisplayTemplate
