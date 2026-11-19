
"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const listRegions = async (): Promise<HttpTypes.StoreRegion[]> => {
  const next = {
    ...(await getCacheOptions("regions")),
  }

  const { regions } = await sdk.client.fetch<{
    regions: HttpTypes.StoreRegion[]
  }>("/store/regions", {
    method: "GET",
    next,
    cache: "no-store",
  })

  return regions ?? []
}

export const retrieveRegion = async (
  id: string
): Promise<HttpTypes.StoreRegion> => {
  const next = {
    ...(await getCacheOptions(["regions", id].join("-"))),
  }

  const { region } = await sdk.client.fetch<{
    region: HttpTypes.StoreRegion
  }>(`/store/regions/${id}`, {
    method: "GET",
    next,
    cache: "no-store",
  })

  return region
}

export const getRegion = async (
  countryCode: string
): Promise<HttpTypes.StoreRegion | undefined> => {
  const normalizedCountryCode = countryCode?.toLowerCase()

  if (!normalizedCountryCode) {
    return undefined
  }

  const regions = await listRegions()

  console.log(
    "[REGIONS]",
    regions.map((region) => ({
      name: region.name,
      id: region.id,
      currency_code: region.currency_code,
      countries: region.countries?.map((country) => country.iso_2),
    }))
  )

  const region = regions.find((item) =>
    item.countries?.some(
      (country) =>
        country.iso_2?.toLowerCase() === normalizedCountryCode
    )
  )

  console.log(
    `[REGION MATCH] country=${normalizedCountryCode}, region=${region?.name ?? "NOT FOUND"}, currency=${region?.currency_code ?? "N/A"}`
  )

  return region
}
