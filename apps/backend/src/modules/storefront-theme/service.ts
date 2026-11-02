
import { MedusaService } from "@medusajs/framework/utils"
import StorefrontTheme from "./models/storefront-theme"

class StorefrontThemeModuleService extends MedusaService({
  StorefrontTheme,
}) {}

export default StorefrontThemeModuleService
