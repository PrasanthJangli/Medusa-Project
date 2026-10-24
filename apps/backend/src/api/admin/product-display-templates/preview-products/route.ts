import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

type CalculatedPrice = {
  calculated_amount?: number | null
  original_amount?: number | null
  currency_code?: string | null
}

type StoreVariant = {
  id: string
  title?: string | null
  calculated_price?: CalculatedPrice | null
}

type StoreProduct = {
  id: string
  title?: string | null
  thumbnail?: string | null
  images?: { url: string }[]
  variants?: StoreVariant[]
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    // 1. Get basic product information
    const productService = req.scope.resolve(
      Modules.PRODUCT
    )

    const baseProducts = await productService.listProducts(
      {},
      {
        select: ["id", "title", "thumbnail"],
        take: 4,
      }
    )

    if (!baseProducts.length) {
      return res.status(200).json({ products: [] })
    }

    // 2. Get an available region
    const query = req.scope.resolve("query")

    const { data: regions } = await query.graph({
      entity: "region",
      fields: ["id", "currency_code"],
    })

    const region = regions?.[0]

    if (!region) {
      return res.status(200).json({
        products: baseProducts.map((product) => ({
          id: product.id,
          title: product.title,
          thumbnail: product.thumbnail,
          images: [],
          price: null,
          currency_code: null,
        })),
        message: "No region is configured.",
      })
    }

    // 3. Read the publishable API key from backend .env
    const publishableKey =
      process.env.MEDUSA_PUBLISHABLE_API_KEY

    if (!publishableKey) {
      console.error(
        "MEDUSA_PUBLISHABLE_API_KEY is missing"
      )

      return res.status(500).json({
        message: "Publishable API key is not configured.",
      })
    }

    const backendUrl = (
      process.env.MEDUSA_BACKEND_URL ||
      "http://localhost:9000"
    ).replace(/\/+$/, "")

    // 4. Request products with calculated prices
    const params = new URLSearchParams({
      region_id: region.id,
      limit: "100",
      fields:
        "id,title,thumbnail,images.url,*variants.calculated_price",
    })

    const response = await fetch(
      `${backendUrl}/store/products?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "x-publishable-api-key": publishableKey,
        },
        cache: "no-store",
      }
    )

    if (!response.ok) {
      const errorText = await response.text()

      console.error(
        "Store products request failed:",
        response.status,
        errorText
      )

      return res.status(502).json({
        message: "Failed to load storefront product prices.",
      })
    }

    const result = (await response.json()) as {
      products?: StoreProduct[]
    }

    const storeProducts = result.products ?? []

    // 5. Match products and extract their available prices
    const products = baseProducts.map((product) => {
      const storeProduct = storeProducts.find(
        (item) => item.id === product.id
      )

      const pricedVariants =
        storeProduct?.variants?.filter(
          (variant) =>
            variant.calculated_price?.calculated_amount != null
        ) ?? []

      const calculatedPrice =
        pricedVariants[0]?.calculated_price

      return {
        id: product.id,
        title: product.title,
        thumbnail:
          product.thumbnail ??
          storeProduct?.thumbnail ??
          storeProduct?.images?.[0]?.url ??
          null,
        images: storeProduct?.images ?? [],
        price:
          calculatedPrice?.calculated_amount ?? null,
        currency_code:
          calculatedPrice?.currency_code ??
          region.currency_code ??
          null,
      }
    })

    // 6. Log the result for debugging
    console.log(
      "Product template preview prices:",
      products.map((product) => ({
        title: product.title,
        price: product.price,
        currency_code: product.currency_code,
      }))
    )

    return res.status(200).json({ products })
  } catch (error) {
    console.error(
      "Failed to load preview products:",
      error
    )

    return res.status(500).json({
      message: "Failed to load preview products.",
    })
  }
}
