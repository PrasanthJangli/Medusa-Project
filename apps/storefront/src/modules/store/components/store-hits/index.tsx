
"use client"

import type { Hit } from "instantsearch.js"
import { useEffect, useRef, useState } from "react"
import { useHits, useInstantSearch } from "react-instantsearch"

import useSearchSettled from "@lib/hooks/use-search-settled"
import {
  getProductDisplayTemplate,
  type ProductDisplayTemplate,
} from "@lib/data/product-display-templates"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text } from "@modules/common/components/ui"
import Thumbnail from "@modules/products/components/thumbnail"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import SearchPagination from "./pagination"
import HitPrice, { type HitPricing } from "./price"

type ProductHit = Hit<
  {
    title: string | null
    handle: string | null
    thumbnail: string | null
  } & HitPricing
>

type StoreHitsProps = {
  hitsPerPage: number
  currencyCode: string
}

const StoreHits = ({
  hitsPerPage,
  currencyCode,
}: StoreHitsProps) => {
  const { items } = useHits<ProductHit>()
  const { status, error, indexUiState } = useInstantSearch()
  const { isSearching, hasNoResultsYet } = useSearchSettled()

  const [selectedTemplate, setSelectedTemplate] =
    useState<ProductDisplayTemplate>("classic-grid")

  useEffect(() => {
    let active = true

    const loadTemplate = async () => {
      try {
        const template = await getProductDisplayTemplate()

        if (active) {
          setSelectedTemplate(template)
        }
      } catch (err) {
        console.error("Could not load product template:", err)
      }
    }

    void loadTemplate()

    return () => {
      active = false
    }
  }, [])

  const { page, ...refinements } = indexUiState
  const currentPage = page ?? 1
  const refinementKey = JSON.stringify(refinements)

  const settled = useRef({
    page: currentPage,
    refinementKey,
  })

  useEffect(() => {
    if (!isSearching) {
      settled.current = {
        page: currentPage,
        refinementKey,
      }
    }
  }, [isSearching, currentPage, refinementKey])

  const isPagingOnly =
    refinementKey === settled.current.refinementKey &&
    currentPage !== settled.current.page

  const showSkeleton =
    hasNoResultsYet || (isSearching && isPagingOnly)

  if (status === "error") {
    return (
      <Text
        className="py-12 text-center text-ui-fg-error"
        data-testid="products-error"
      >
        Couldn't load products
        {error?.message ? `: ${error.message}` : "."}
      </Text>
    )
  }

  const isListView = selectedTemplate === "list-view"
  const isPremium = selectedTemplate === "premium-card"
  const isImageFocused = selectedTemplate === "image-focused"

  const gridClass = isListView
    ? "flex w-full min-w-0 flex-col gap-4"
    : isImageFocused
      ? "grid w-full min-w-0 grid-cols-2 gap-3 sm:gap-5 lg:gap-6"
      : "grid w-full min-w-0 grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"

  const cardClass =
    "group relative flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl"

  return (
    <>
      {showSkeleton ? (
        <SkeletonProductGrid numberOfProducts={hitsPerPage} />
      ) : items.length === 0 ? (
        <div
          className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-16 text-center"
          data-testid="no-products"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-3xl">
            🔎
          </div>
          <Text className="mt-4 text-base font-semibold text-slate-900">
            No products found
          </Text>
          <Text className="mt-2 text-sm text-slate-500">
            Try changing your search or filters.
          </Text>
        </div>
      ) : (
        <ul className={gridClass} data-testid="products-list">
          {items.map((hit) =>
            hit.handle ? (
              <li
                key={hit.objectID}
                className={[
                  cardClass,
                  isListView ? "sm:flex-row" : "",
                  isImageFocused ? "rounded-3xl" : "",
                ].join(" ")}
              >
                <LocalizedClientLink
                  href={`/products/${hit.handle}`}
                  className={[
                    "flex min-w-0 flex-1",
                    isListView
                      ? "w-full flex-col sm:flex-row"
                      : "w-full flex-col",
                  ].join(" ")}
                >
                  {/* Premium collection label */}
                  {isPremium && (
                    <div className="relative overflow-hidden bg-gradient-to-r from-violet-950 via-violet-900 to-purple-800 px-3 py-3 text-white sm:px-4">
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-5 -top-8 h-20 w-20 rounded-full bg-fuchsia-400/20 blur-2xl"
                      />
                      <p className="relative text-[9px] font-bold uppercase tracking-[0.18em] text-violet-200">
                        Premium collection
                      </p>
                      <p className="relative mt-1 text-xs font-semibold">
                        A closer look at your next favourite
                      </p>
                    </div>
                  )}

                  {/* Product image */}
                  <div
                    className={[
                      "relative min-w-0 overflow-hidden",
                      isListView
                        ? "w-full shrink-0 bg-slate-50 p-3 sm:w-52"
                        : isImageFocused
                          ? "w-full bg-[#f5f2fa] p-2.5 sm:p-3"
                          : "w-full bg-slate-50 p-2.5 sm:p-3",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "relative w-full overflow-hidden bg-white",
                        isListView
                          ? "aspect-square rounded-xl sm:aspect-[4/3]"
                          : isImageFocused
                            ? "aspect-[4/5] rounded-2xl"
                            : "aspect-square rounded-xl",
                      ].join(" ")}
                    >
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-violet-50/60 via-transparent to-slate-100/70"
                      />

                      <div className="relative z-[1] h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.045]">
                        <Thumbnail
                          thumbnail={hit.thumbnail}
                          size="full"
                          className="!h-full !w-full !aspect-auto !rounded-xl !bg-transparent !p-0 !shadow-none"
                        />
                      </div>

                      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-16 bg-gradient-to-t from-black/[0.04] to-transparent" />

                      {isImageFocused && (
                        <span className="absolute left-3 top-3 z-[3] rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-violet-800 shadow-sm backdrop-blur">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product information */}
                  <div
                    className={[
                      "flex min-w-0 flex-1 flex-col",
                      isListView
                        ? "gap-3 p-4 sm:p-5"
                        : "gap-3 p-3 sm:p-4",
                    ].join(" ")}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                          Available product
                        </span>
                      </div>

                      <Text
                        className="line-clamp-2 min-h-10 text-xs font-bold leading-5 text-slate-900 transition-colors duration-200 group-hover:text-violet-700 sm:text-sm"
                        data-testid="product-title"
                      >
                        {hit.title || "Untitled product"}
                      </Text>

                      {isPremium && (
                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          Discover product details and available options.
                        </p>
                      )}

                      {isListView && (
                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          Select this product to view details and available options.
                        </p>
                      )}

                      {isImageFocused && (
                        <div className="mt-3 h-1 w-9 rounded-full bg-violet-400 transition-all duration-300 group-hover:w-14" />
                      )}
                    </div>

                    {/* Actual Medusa price */}
                    <div className="mt-auto border-t border-slate-100 pt-3">
                      <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Price
                      </p>

                      <div
                        className="text-sm font-extrabold tracking-tight text-slate-950 sm:text-base"
                        data-testid="product-price"
                      >
                        <HitPrice
                          hit={hit}
                          currencyCode={currencyCode}
                        />
                      </div>
                    </div>

                    {/* Product detail link */}
                    <div className="flex min-h-10 items-center justify-center gap-2 rounded-xl bg-violet-600 px-3 py-2.5 text-[11px] font-bold text-white transition-all duration-200 group-hover:bg-violet-700 group-hover:shadow-md sm:text-xs">
                      <span>View product</span>
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </div>
                  </div>
                </LocalizedClientLink>
              </li>
            ) : null
          )}
        </ul>
      )}

      <div className="mt-8 border-t border-slate-200 pt-6">
        <SearchPagination />
      </div>
    </>
  )
}

export default StoreHits
