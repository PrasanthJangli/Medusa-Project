
import { NextResponse } from "next/server"

export async function GET() {
  const backendUrl = (
    process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
  ).replace(/\/+$/, "")

  const publishableKey =
    process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  if (!publishableKey) {
    return NextResponse.json(
      { message: "Publishable API key missing" },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(
      `${backendUrl}/store/product-display-template`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "x-publishable-api-key": publishableKey,
        },
        cache: "no-store",
      }
    )

    const body = await response.text()

    console.log("Template backend URL:", backendUrl)
    console.log("Template backend status:", response.status)
    console.log("Template backend body:", body.slice(0, 500))

    let data: unknown

    try {
      data = JSON.parse(body)
    } catch {
      return NextResponse.json(
        {
          message: "Backend returned HTML or invalid JSON",
          backendStatus: response.status,
          backendResponse: body.slice(0, 300),
        },
        { status: 502 }
      )
    }

    return NextResponse.json(data, {
      status: response.status,
      headers: { "Cache-Control": "no-store" },
    })
  } catch (error) {
    console.error("Template proxy connection error:", error)

    return NextResponse.json(
      { message: "Could not connect to Medusa backend" },
      { status: 502 }
    )
  }
}
