
import { model } from "@medusajs/framework/utils"

const StorefrontTheme = model.define("storefront_theme", {
  id: model.id().primaryKey(),
  name: model.text(),
  preset: model.enum([
    "fashion",
    "electronics",
    "furniture",
    "beauty",
    "custom",
  ]).default("fashion"),
  settings: model.json(),
  status: model.enum([
    "draft",
    "published",
    "archived",
  ]).default("draft"),
})

export default StorefrontTheme
