import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
      "http://localhost:9000"

    const publishableKey =
      process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

    if (!publishableKey) {
      console.error("Publishable API key is missing")

      return NextResponse.json(
        {
          error: "Publishable API key is missing",
        },
        { status: 500 }
      )
    }

    const response = await fetch(
      `${backendUrl}/store/orders/${id}/invoices`,
      {
        method: "GET",
        headers: {
          Accept: "application/pdf",
          "x-publishable-api-key": publishableKey,
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()

      console.error(
        "Invoice API error:",
        response.status,
        errorText
      )

      return NextResponse.json(
        {
          error: "Failed to download invoice",
          status: response.status,
          details: errorText,
        },
        { status: response.status }
      )
    }

    const pdf = await response.arrayBuffer()

    return new NextResponse(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${id}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Invoice download failed:", error)

    return NextResponse.json(
      {
        error: "Invoice download failed",
      },
      { status: 500 }
    )
  }
}