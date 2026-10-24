
import React, { Suspense } from "react"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product?.id) {
    return notFound()
  }

  return (
    <main
      className="min-h-screen overflow-x-hidden bg-[#f8f7fc] text-slate-900"
      data-testid="product-container"
    >
      {/* Breadcrumb-style heading */}
      <section className="mx-auto w-full max-w-[1800px] px-4 pt-5 sm:px-6 lg:px-10 lg:pt-8">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 sm:text-sm">
          <span>Store</span>
          <span aria-hidden="true">/</span>
          <span className="text-violet-700">Product details</span>
        </div>

        <div className="mt-5 overflow-hidden rounded-3xl bg-gradient-to-r from-violet-950 via-violet-900 to-[#6741a5] px-5 py-7 text-white shadow-lg sm:px-8 sm:py-9 lg:px-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-200">
                Discover something special
              </p>

              <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                Find your next favourite.
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-violet-100/80 sm:text-base">
                Explore product images, details and available options before
                making your selection.
              </p>
            </div>

            <div className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-white/20 bg-white/10 text-4xl backdrop-blur sm:flex">
              ✨
            </div>
          </div>
        </div>
      </section>

      {/* Product information and purchase area */}
      <section className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:gap-8">
          {/* Product image gallery */}
          <div className="min-w-0">
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-3 shadow-sm sm:p-5 lg:p-7">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700">
                    Product gallery
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
                    Take a closer look
                  </h2>
                </div>

                <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
                  Product images
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl bg-[#f7f5fb] p-2 sm:p-3">
                <ImageGallery images={images} />
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                    🖼️
                  </span>

                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Explore the gallery
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      View the available product images
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                    ✨
                  </span>

                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Find your fit
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Review product options before purchase
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product description and information */}
            <div className="mt-5 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7 lg:mt-7">
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700">
                  Product information
                </p>

                <h2 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                  Know your product
                </h2>
              </div>

              <ProductTabs product={product} />
            </div>
          </div>

          {/* Product information and purchase options */}
          <div className="min-w-0 space-y-5 xl:sticky xl:top-6">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-xl">
                  🛍️
                </span>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700">
                    Product overview
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Details and pricing
                  </p>
                </div>
              </div>

              <div className="min-w-0">
                <ProductInfo product={product} />
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-sm">
              <div className="bg-gradient-to-r from-violet-950 to-violet-800 px-5 py-5 text-white sm:px-7">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-200">
                  Your selection
                </p>

                <h2 className="mt-2 text-xl font-extrabold sm:text-2xl">
                  Ready to choose?
                </h2>

                <p className="mt-2 text-sm leading-6 text-violet-100/80">
                  Select an available variant and review your options.
                </p>
              </div>

              <div className="p-5 sm:p-7">
                <ProductOnboardingCta />

                <Suspense
                  fallback={
                    <ProductActions
                      disabled={true}
                      product={product}
                      region={region}
                    />
                  }
                >
                  <ProductActionsWrapper
                    id={product.id}
                    region={region}
                  />
                </Suspense>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-lg">
                      ✓
                    </span>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Review before adding to cart
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Check your selected options and product details before
                        continuing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related products */}
      <section
        className="mx-auto my-5 w-full max-w-[1800px] px-4 pb-10 sm:px-6 sm:pb-14 lg:px-10"
        data-testid="related-products-container"
      >
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7 lg:p-9">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-700">
                More to discover
              </p>

              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                You may also like
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                Explore more products from our store.
              </p>
            </div>

            <span className="inline-flex items-center gap-2 self-start rounded-full bg-violet-50 px-4 py-2 text-xs font-bold text-violet-700 sm:self-auto">
              Discover more
              <span aria-hidden="true">→</span>
            </span>
          </div>

          <Suspense fallback={<SkeletonRelatedProducts />}>
            <RelatedProducts
              product={product}
              countryCode={countryCode}
            />
          </Suspense>
        </div>
      </section>
    </main>
  )
}

export default ProductTemplate
