"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const retrieveCollection = async (
  id: string
): Promise<HttpTypes.StoreCollection> => {
  const next = await getCacheOptions("collections")

  const { collection } = await sdk.client.fetch<{
    collection: HttpTypes.StoreCollection
  }>(`/store/collections/${id}`, {
    next,
    cache: "no-store",
  })

  return collection
}

export const listCollections = async (
  queryParams: Record<string, string> = {}
): Promise<{
  collections: HttpTypes.StoreCollection[]
  count: number
}> => {
  const next = await getCacheOptions("collections")

  const query = {
    ...queryParams,
    fields:
      queryParams.fields ||
      "+products.id,+products.title,+products.thumbnail",
    limit: queryParams.limit || "100",
    offset: queryParams.offset || "0",
  }

  const { collections, count } = await sdk.client.fetch<{
    collections: HttpTypes.StoreCollection[]
    count: number
  }>("/store/collections", {
    query,
    next,
    cache: "no-store",
  })

  console.log(
    "Collections product count:",
    collections?.map((collection) => ({
      title: collection.title,
      products: collection.products?.length,
      productNames: collection.products?.map(
        (product) => product.title
      ),
    }))
  )

  return {
    collections: collections ?? [],
    count: count ?? 0,
  }
}

export const getCollectionByHandle = async (
  handle: string
): Promise<HttpTypes.StoreCollection | null> => {
  const next = await getCacheOptions("collections")

  const { collections } =
    await sdk.client.fetch<HttpTypes.StoreCollectionListResponse>(
      "/store/collections",
      {
        query: {
          handle,
          fields:
            "*products,+products.id,+products.title,+products.thumbnail",
        },
        next,
        cache: "no-store",
      }
    )

  return collections?.[0] ?? null
}
