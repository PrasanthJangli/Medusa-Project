
export type ProductDisplayTemplate =
  | "classic-grid"
  | "premium-card"
  | "list-view"
  | "image-focused"

const validTemplates: ProductDisplayTemplate[] = [
  "classic-grid",
  "premium-card",
  "list-view",
  "image-focused",
]

export async function getProductDisplayTemplate(): Promise<ProductDisplayTemplate> {
  try {
    // Same-origin Next.js API route; browser CORS issue avoid avuthundhi.
    const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000"

const response = await fetch(
  `${baseUrl}/api/product-display-template`,
  {
    cache: "no-store",
    })

    if (!response.ok) {
      console.error("Failed to fetch template:", response.status)
      return "classic-grid"
    }

    const data: { selectedTemplate?: string } = await response.json()
    const selected = data.selectedTemplate

    if (
      selected &&
      validTemplates.includes(selected as ProductDisplayTemplate)
    ) {
      return selected as ProductDisplayTemplate
    }

    return "classic-grid"
  } catch (error) {
    console.error("Error fetching product display template:", error)
    return "classic-grid"
  }
}
