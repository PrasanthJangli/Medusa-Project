
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

  settings: model.json().default({
    colors: {
      primary: "#2563EB",
      secondary: "#F59E0B",
      background: "#FFFFFF",
      text: "#111827",

      navbarBackground: "#0B2D70",
      navbarText: "#FFFFFF",

      footerBackground: "#071B3D",
      footerText: "#FFFFFF",
    },

    typography: {
      fontFamily: "Inter",
    },

    buttons: {
      borderRadius: "8px",
    },

    spacing: {
      scale: "comfortable",
    },
  }),

  status: model.enum([
    "draft",
    "published",
    "archived",
  ]).default("draft"),
})

export default StorefrontTheme
