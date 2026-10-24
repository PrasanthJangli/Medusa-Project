
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductReviewForm from "@modules/products/components/product-review-form"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info" className="w-full">
      <div className="mx-auto flex w-full flex-col gap-y-6 rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm sm:p-7 lg:p-8">
        {/* Collection */}
        {product.collection && (
          <div>
            <LocalizedClientLink
              href={`/collections/${product.collection.handle}`}
              className="inline-flex items-center gap-2 rounded-full border border-[#dbeafe] bg-[#eff6ff] px-3 py-1.5 text-xs font-semibold text-[#245b80] transition hover:bg-[#dbeafe]"
            >
              <span aria-hidden="true">←</span>
              {product.collection.title}
            </LocalizedClientLink>
          </div>
        )}

        {/* Product heading */}
        <div className="space-y-3">
          <span className="inline-flex items-center rounded-full bg-[#ecfdf5] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#047857]">
            Product details
          </span>

          <Heading
            level="h2"
            className="text-2xl font-extrabold leading-tight tracking-tight text-[#172b4d] sm:text-3xl lg:text-4xl"
            data-testid="product-title"
          >
            {product.title}
          </Heading>

          <div className="h-1 w-14 rounded-full bg-[#176b87]" />
        </div>

        {/* Product description */}
        {product.description ? (
          <div className="rounded-xl bg-[#f8fafc] p-4 sm:p-5">
            <h3 className="mb-2 text-sm font-bold text-[#172b4d]">
              About this product
            </h3>

            <Text
              className="whitespace-pre-line text-sm leading-7 text-[#64748b] sm:text-base"
              data-testid="product-description"
            >
              {product.description}
            </Text>
          </div>
        ) : (
          <Text className="text-sm leading-6 text-[#64748b]">
            More product information may be available in the product options below.
          </Text>
        )}

        {/* Product information note */}
        <div className="flex items-start gap-3 rounded-xl border border-[#e2e8f0] p-4">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eff6ff] text-xl"
          >
            ℹ️
          </span>

          <div>
            <h3 className="text-sm font-semibold text-[#172b4d]">
              Need more details?
            </h3>

            <p className="mt-1 text-xs leading-5 text-[#64748b]">
              Review the product information and available options before adding it to your cart.
            </p>
          </div>
        </div>
      </div>

      {/* Product reviews */}
      <section className="mt-8 rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#176b87]">
            Customer feedback
          </span>

          <Heading
            level="h3"
            className="mt-2 text-xl font-bold tracking-tight text-[#172b4d] sm:text-2xl"
          >
            Product reviews
          </Heading>

          <Text className="mt-2 text-sm leading-6 text-[#64748b]">
            Share your feedback about this product.
          </Text>
        </div>

        <ProductReviewForm productId={product.id} />
      </section>
    </div>
  )
}

export default ProductInfo
