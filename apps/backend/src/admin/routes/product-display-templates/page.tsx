
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { useEffect, useState } from "react"

const templates = [
  {
    id: "classic-grid",
    name: "Classic Grid",
    description: "Simple product cards in a grid layout.",
  },
  {
    id: "premium-card",
    name: "Premium Card",
    description: "Stylish cards with rounded corners and shadows.",
  },
  {
    id: "list-view",
    name: "List View",
    description: "Products displayed in a horizontal list.",
  },
  {
    id: "image-focused",
    name: "Image-Focused",
    description: "Large images with minimal text.",
  },
] as const

type TemplateName = (typeof templates)[number]["id"]

type Product = {
  id: string
  title: string
  thumbnail?: string | null
  images?: { url: string }[]

  // Price fields returned by the preview-products API
  price?: number | null
  currency_code?: string | null

  // Keep support for the nested Medusa Store API response too
  variants?: {
    calculated_price?: {
      calculated_amount?: number | null
      currency_code?: string | null
    } | null
  }[]
}

const ProductDisplayTemplatesPage = () => {
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateName>("classic-grid")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [productsLoading, setProductsLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    let active = true

    const loadData = async () => {
      try {
        const response = await fetch("/admin/product-display-templates", {
          headers: { Accept: "application/json" },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to load template")
        }

        const savedTemplate =
          data.selectedTemplate ?? data.templates?.[0]?.template

        if (
          active &&
          templates.some((item) => item.id === savedTemplate)
        ) {
          setSelectedTemplate(savedTemplate as TemplateName)
        }
      } catch (error) {
        if (active) {
          setMessage(
            error instanceof Error
              ? error.message
              : "Could not load the saved template."
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }

      try {
        const productsResponse = await fetch(
          "/admin/product-display-templates/preview-products",
          {
            headers: { Accept: "application/json" },
          }
        )

        const productsData = await productsResponse.json()

        if (!productsResponse.ok) {
          throw new Error(
            productsData.message || "Could not load preview products."
          )
        }

        if (active) {
          // The API returns price and currency_code at product level.
          const loadedProducts: Product[] = (
            productsData.products ?? []
          ).map((product: Product) => ({
            ...product,
            price:
              product.price ??
              product.variants?.find(
                (variant) =>
                  variant.calculated_price?.calculated_amount != null
              )?.calculated_price?.calculated_amount ??
              null,
            currency_code:
              product.currency_code ??
              product.variants?.find(
                (variant) =>
                  variant.calculated_price?.calculated_amount != null
              )?.calculated_price?.currency_code ??
              null,
          }))

          setProducts(loadedProducts)
        }
      } catch (error) {
        if (active) {
          setMessage(
            error instanceof Error
              ? error.message
              : "Could not load product previews."
          )
        }
      } finally {
        if (active) {
          setProductsLoading(false)
        }
      }
    }

    void loadData()

    return () => {
      active = false
    }
  }, [])

  const saveTemplate = async () => {
    setSaving(true)
    setMessage("")

    try {
      const response = await fetch("/admin/product-display-templates", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ template: selectedTemplate }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to save template")
      }

      setMessage("Template saved successfully!")
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to save template."
      )
    } finally {
      setSaving(false)
    }
  }

  const formatPrice = (product: Product) => {
    const amount =
      product.price ??
      product.variants?.find(
        (variant) =>
          variant.calculated_price?.calculated_amount != null
      )?.calculated_price?.calculated_amount

    const currency =
      product.currency_code ??
      product.variants?.find(
        (variant) =>
          variant.calculated_price?.calculated_amount != null
      )?.calculated_price?.currency_code ??
      "eur"

    if (amount == null || !Number.isFinite(amount)) {
      return "Price unavailable"
    }

    try {
      return new Intl.NumberFormat("en", {
        style: "currency",
        currency: currency.toUpperCase(),
      }).format(amount)
    } catch {
      return `${amount} ${currency.toUpperCase()}`
    }
  }

  const ProductPreview = ({ product }: { product: Product }) => {
    const image = product.thumbnail || product.images?.[0]?.url

    return (
      <div
        style={{
          minWidth: 0,
          overflow: "hidden",
          borderRadius: 8,
          background: "#fff",
          border: "1px solid #e5e7eb",
        }}
      >
        {image ? (
          <img
            src={image}
            alt={product.title}
            style={{
              display: "block",
              width: "100%",
              height: selectedTemplate === "image-focused" ? 170 : 110,
              objectFit: "cover",
              background: "#f3f4f6",
            }}
          />
        ) : (
          <div
            style={{
              height: selectedTemplate === "image-focused" ? 170 : 110,
              background: "#f3f4f6",
              display: "grid",
              placeItems: "center",
              color: "#6b7280",
              fontSize: 12,
            }}
          >
            No image
          </div>
        )}

        <div style={{ padding: 10 }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: 13,
              marginBottom: 6,
              overflowWrap: "anywhere",
            }}
          >
            {product.title}
          </div>

          {selectedTemplate !== "image-focused" && (
            <div style={{ fontSize: 12, color: "#6d28d9" }}>
              {formatPrice(product)}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: 32, maxWidth: 1100 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>
        Product Display Templates
      </h1>

      <p style={{ marginTop: 8, marginBottom: 24 }}>
        Select a design and preview it with your real products before saving.
      </p>

      {loading ? (
        <p>Loading saved template...</p>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {templates.map((template) => {
              const isSelected = selectedTemplate === template.id

              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => {
                    setSelectedTemplate(template.id)
                    setMessage("")
                  }}
                  style={{
                    padding: 16,
                    textAlign: "left",
                    borderRadius: 12,
                    border: isSelected
                      ? "2px solid #7c3aed"
                      : "1px solid #d1d5db",
                    background: isSelected ? "#f5f3ff" : "#fff",
                    cursor: "pointer",
                    color: "#111827",
                  }}
                >
                  <div style={{ fontSize: 18, fontWeight: 600 }}>
                    {template.name}
                  </div>

                  <p style={{ marginTop: 8, color: "#6b7280" }}>
                    {template.description}
                  </p>

                  {productsLoading ? (
                    <p style={{ marginTop: 16 }}>Loading products...</p>
                  ) : products.length === 0 ? (
                    <p style={{ marginTop: 16 }}>
                      No preview products available.
                    </p>
                  ) : (
                    <div
                      style={{
                        marginTop: 16,
                        display: "grid",
                        gridTemplateColumns:
                          template.id === "list-view"
                            ? "1fr"
                            : "repeat(2, minmax(0, 1fr))",
                        gap: 10,
                      }}
                    >
                      {products.slice(0, 2).map((product) => (
                        <div
                          key={product.id}
                          style={
                            template.id === "list-view"
                              ? {
                                  display: "grid",
                                  gridTemplateColumns:
                                    "90px minmax(0, 1fr)",
                                  gap: 10,
                                  alignItems: "center",
                                }
                              : undefined
                          }
                        >
                          <ProductPreview product={product} />
                        </div>
                      ))}
                    </div>
                  )}

                  <p style={{ marginTop: 16, fontWeight: 600 }}>
                    {isSelected ? "✓ Selected" : "Click to select"}
                  </p>
                </button>
              )
            })}
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={saveTemplate}
            style={{
              marginTop: 24,
              padding: "12px 20px",
              background: "#7c3aed",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: saving ? "wait" : "pointer",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Saving..." : "Save Template"}
          </button>

          <p style={{ marginTop: 16 }}>
            Selected template: <strong>{selectedTemplate}</strong>
          </p>

          {message && (
            <p
              role="status"
              style={{
                marginTop: 12,
                color: message.includes("successfully")
                  ? "#15803d"
                  : "#dc2626",
              }}
            >
              {message}
            </p>
          )}
        </>
      )}
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Product Templates",
})

export default ProductDisplayTemplatesPage
