
import { loadEnv, defineConfig } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,

    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
  },

  modules: [
    {
      resolve: "./src/modules/invoice-generator",
    },
    {
      resolve: "./src/modules/product-review",
    },
    {
      resolve: "./src/modules/product-display-template",
    },
    {
      resolve: "./src/modules/storefront-theme",
    },
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "./src/modules/cashfree-payment",
            id: "cashfree",
            options: {
              appId: process.env.CASHFREE_APP_ID!,
              secretKey: process.env.CASHFREE_SECRET_KEY!,
              environment: process.env.CASHFREE_ENV || "sandbox",
              returnUrl: process.env.CASHFREE_RETURN_URL,
            },
          },
        ],
      },
    },
  ],
})
