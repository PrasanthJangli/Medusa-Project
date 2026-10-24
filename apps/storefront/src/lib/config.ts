import { getLocaleHeader } from "@lib/util/get-locale-header"
import Medusa, { FetchArgs, FetchInput } from "@medusajs/js-sdk"

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  "http://localhost:9000"

const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: PUBLISHABLE_KEY,
})

const originalFetch = sdk.client.fetch.bind(sdk.client)

sdk.client.fetch = async <T>(
  input: FetchInput,
  init?: FetchArgs
): Promise<T> => {
  let localeHeader: Record<string, string | null> | undefined

  try {
    localeHeader = await getLocaleHeader()
  } catch {
    // Continue without the optional locale header
  }

  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string> | undefined),
  }

  if (PUBLISHABLE_KEY && !headers["x-publishable-api-key"]) {
    headers["x-publishable-api-key"] = PUBLISHABLE_KEY
  }

  const locale = localeHeader?.["x-medusa-locale"]

  if (locale && !headers["x-medusa-locale"]) {
    headers["x-medusa-locale"] = locale
  }

  return originalFetch(input, {
    ...init,
    headers,
  })
}
