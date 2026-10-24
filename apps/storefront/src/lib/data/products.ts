
"use server"

import { sdk } from "@lib/config"
import { OptionValueIds } from "@lib/util/product-option-filters"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"

type ProductListQueryParams = (
  HttpTypes.FindParams &
  HttpTypes.StoreProductListParams
) & {
  options?: string[]
  option_value_id?: string | string[]
}

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: ProductListQueryParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: {
    products: HttpTypes.StoreProduct[]
    count: number
  }
  nextPage: number | null
  queryParams?: ProductListQueryParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const currentPage = Math.max(pageParam, 1)
  const offset = (currentPage - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: {
        products: [],
        count: 0,
      },
      nextPage: null,
      queryParams,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  const { products, count } = await sdk.client.fetch<{
    products: HttpTypes.StoreProduct[]
    count: number
  }>("/store/products", {
    method: "GET",
    query: {
      limit,
      offset,
      region_id: region.id,
      fields:
        "*variants.calculated_price,+variants.inventory_quantity,*variants.images,*variants.options,+metadata,+tags",
      ...queryParams,
    },
    headers,
    next,
    cache: "force-cache",
  })

  return {
    response: {
      products,
      count,
    },
    nextPage:
      count > offset + limit ? currentPage + 1 : null,
    queryParams,
  }
}

/**
 * Fetch products, sort them, and return the requested page.
 */
export const listProductsWithSort = async ({
  page = 1,
  queryParams,
  sortBy = "created_at",
  countryCode,
  optionValueIds,
}: {
  page?: number
  queryParams?: ProductListQueryParams
  sortBy?: SortOptions
  countryCode: string
  optionValueIds?: OptionValueIds
}): Promise<{
  response: {
    products: HttpTypes.StoreProduct[]
    count: number
  }
  nextPage: number | null
  queryParams?: ProductListQueryParams
}> => {
  const limit = queryParams?.limit || 12

  const optionFilters = Array.from(
    new Set((optionValueIds || []).filter(Boolean))
  )

  const {
    response: {
      products,
      count,
    },
  } = await listProducts({
    pageParam: 1,
    queryParams: {
      ...queryParams,
      ...(optionFilters.length > 0
        ? { option_value_id: optionFilters }
        : {}),
      limit: 100,
      offset: 0,
    },
    countryCode,
  })

  const sortedProducts = sortProducts(products, sortBy)

  const currentPage = Math.max(page, 1)
  const startIndex = (currentPage - 1) * limit

  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + limit
  )

  return {
    response: {
      products: paginatedProducts,
      count,
    },
    nextPage:
      count > startIndex + limit
        ? currentPage + 1
        : null,
    queryParams,
  }
}
