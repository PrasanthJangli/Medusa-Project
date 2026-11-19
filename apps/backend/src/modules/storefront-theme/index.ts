
import { Module } from "@medusajs/framework/utils"
import StorefrontThemeModuleService from "./service"

export const STOREFRONT_THEME_MODULE = "storefrontTheme"

export default Module(STOREFRONT_THEME_MODULE, {
  service: StorefrontThemeModuleService,
})
