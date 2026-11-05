
import { HttpTypes } from "@medusajs/types"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

const DEFAULT_REGION = (
  process.env.NEXT_PUBLIC_DEFAULT_REGION || "in"
).toLowerCase()

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
}

async function getRegionMap(cacheId: string) {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (!BACKEND_URL) {
    throw new Error(
      "Middleware: NEXT_PUBLIC_MEDUSA_BACKEND_URL is missing."
    )
  }

  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    const response = await fetch(
      `${BACKEND_URL}/store/regions`,
      {
        method: "GET",
        headers: {
          "x-publishable-api-key": PUBLISHABLE_API_KEY!,
        },
        next: {
          revalidate: 3600,
          tags: [`regions-${cacheId}`],
        },
        cache: "force-cache",
      }
    )

    if (!response.ok) {
      throw new Error(
        `Unable to fetch Medusa regions: ${response.status}`
      )
    }

    const json = await response.json()
    const regions = json.regions ?? []

    regionMapCache.regionMap.clear()

    regions.forEach((region: HttpTypes.StoreRegion) => {
      region.countries?.forEach((country) => {
        const countryCode = country.iso_2?.toLowerCase()

        if (countryCode) {
          regionMapCache.regionMap.set(countryCode, region)
        }
      })
    })

    regionMapCache.regionMapUpdated = Date.now()
  }

  return regionMap
}

async function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion>
) {
  const urlCountryCode = request.nextUrl.pathname
    .split("/")[1]
    ?.toLowerCase()

  const cloudflareCountryCode = (
    request as NextRequest & {
      cf?: { country?: string }
    }
  ).cf?.country?.toLowerCase()

  const vercelCountryCode = request.headers
    .get("x-vercel-ip-country")
    ?.toLowerCase()

  if (urlCountryCode && regionMap.has(urlCountryCode)) {
    return urlCountryCode
  }

  if (
    cloudflareCountryCode &&
    regionMap.has(cloudflareCountryCode)
  ) {
    return cloudflareCountryCode
  }

  if (
    vercelCountryCode &&
    regionMap.has(vercelCountryCode)
  ) {
    return vercelCountryCode
  }

  if (regionMap.has(DEFAULT_REGION)) {
    return DEFAULT_REGION
  }

  return regionMap.keys().next().value
}

/**
 * Middleware for country routing and theme preview.
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip Next.js assets, API routes and files.
  if (
    pathname.includes(".") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/")
  ) {
    return NextResponse.next()
  }

  const cacheIdCookie = request.cookies.get("_medusa_cache_id")
  const cacheId = cacheIdCookie?.value || crypto.randomUUID()

  const regionMap = await getRegionMap(cacheId)

  if (!regionMap.size) {
    return NextResponse.next()
  }

  const countryCode = await getCountryCode(request, regionMap)

  if (!countryCode) {
    return NextResponse.next()
  }

  const country = countryCode.toLowerCase()

  const firstPathSegment = pathname
    .split("/")
    .filter(Boolean)[0]
    ?.toLowerCase()

  // The URL already contains a valid country code.
  if (firstPathSegment === country) {
    const response = NextResponse.next()

    if (!cacheIdCookie) {
      response.cookies.set("_medusa_cache_id", cacheId, {
        maxAge: 60 * 60 * 24,
        httpOnly: true,
        sameSite: "lax",
      })
    }

    return response
  }

  // Preserve the complete pathname and query string,
  // including themePreview=1.
  const redirectUrl = request.nextUrl.clone()

  redirectUrl.pathname =
    pathname === "/"
      ? `/${country}`
      : `/${country}${pathname}`

  const response = NextResponse.redirect(redirectUrl, 307)

  if (!cacheIdCookie) {
    response.cookies.set("_medusa_cache_id", cacheId, {
      maxAge: 60 * 60 * 24,
      httpOnly: true,
      sameSite: "lax",
    })
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
