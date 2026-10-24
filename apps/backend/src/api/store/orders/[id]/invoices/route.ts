
import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

import { Modules } from "@medusajs/framework/utils"
import { INVOICE_MODULE } from "../../../../../modules/invoice-generator"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const orderId = req.params.id

    // Resolve Invoice Module
    const invoiceService = req.scope.resolve(INVOICE_MODULE)

    // Resolve Order Module in Medusa v2
    const orderService = req.scope.resolve(Modules.ORDER)

    // Retrieve order details
    const order = await orderService.retrieveOrder(orderId, {
      relations: [
        "items",
        "shipping_address",
        "billing_address",
        "shipping_methods",
        "payment_collections",
        "fulfillments",
        "customer",
      ],
    })

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      })
    }

    // Generate PDF
    const pdfBuffer =
      await invoiceService.generateInvoicePDF(order)

    // Send PDF for download
    res.setHeader("Content-Type", "application/pdf")

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="invoice-${orderId}.pdf"`
    )

    res.setHeader(
      "Content-Length",
      pdfBuffer.length.toString()
    )

    return res.status(200).send(pdfBuffer)
  } catch (error) {
    console.error("Invoice generation failed:", error)

    return res.status(500).json({
      message: "Failed to generate invoice",
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    })
  }
}

