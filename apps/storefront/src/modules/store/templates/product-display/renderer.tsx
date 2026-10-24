
import { HttpTypes } from "@medusajs/types"


import ClassicGrid from "./classic-grid"
import PremiumCard from "./premium-card"
import ListView from "./list-view"
import ImageFocused from "./image-focused"


export type ProductDisplayTemplate =
  | "classic-grid"
  | "premium-card"
  | "list-view"
  | "image-focused"

type ProductTemplateRendererProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  template: ProductDisplayTemplate
}

export default function ProductTemplateRenderer({
  product,
  region,
  template,
}: ProductTemplateRendererProps) {
  switch (template) {
    case "premium-card":
      return <PremiumCard product={product} region={region} />

    case "list-view":
      return <ListView product={product} region={region} />

    case "image-focused":
      return <ImageFocused product={product} region={region} />

    case "classic-grid":
    default:
      return <ClassicGrid product={product} region={region} />
  }
}
