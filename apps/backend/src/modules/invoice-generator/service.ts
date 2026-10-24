
import { MedusaService } from "@medusajs/framework/utils"
import pdfmake from "pdfmake"
import type { TDocumentDefinitions } from "pdfmake/interfaces"
import path from "path"

import { InvoiceConfig } from "./models/invoice-config"
import { Invoice } from "./models/invoice"

const fonts = {
  Roboto: {
    normal: path.resolve(
      process.cwd(),
      "../../node_modules/pdfmake/fonts/Roboto/Roboto-Regular.ttf"
    ),
    bold: path.resolve(
      process.cwd(),
      "../../node_modules/pdfmake/fonts/Roboto/Roboto-Medium.ttf"
    ),
    italics: path.resolve(
      process.cwd(),
      "../../node_modules/pdfmake/fonts/Roboto/Roboto-Italic.ttf"
    ),
    bolditalics: path.resolve(
      process.cwd(),
      "../../node_modules/pdfmake/fonts/Roboto/Roboto-MediumItalic.ttf"
    ),
  },
}

pdfmake.addFonts(fonts)

class InvoiceGeneratorService extends MedusaService({
  InvoiceConfig,
  Invoice,
}) {
  async generateInvoicePDF(order: any): Promise<Buffer> {
    const currency = (order.currency_code || "eur").toUpperCase()

    const money = (value: any) =>
      `${currency} ${Number(value ?? 0).toFixed(2)}`

    const formatStatus = (value: any): string => {
      if (!value || typeof value !== "string") {
        return ""
      }

      return value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
    }

    // Derive payment status from the available order/payment data.
    const getPaymentStatus = (): string => {
      const orderStatus = order.payment_status

      if (typeof orderStatus === "string" && orderStatus.length > 0) {
        return formatStatus(orderStatus)
      }

      const collections = order.payment_collections || []

      const collectionStatuses = collections
        .map((collection: any) => collection.status)
        .filter(
          (status: any) =>
            typeof status === "string" && status.length > 0
        )

      if (collectionStatuses.length > 0) {
        return [...new Set(collectionStatuses)]
          .map(formatStatus)
          .join(", ")
      }

      const payments = collections.flatMap((collection: any) =>
        collection.payments || []
      )

      const paymentStatuses = payments
        .map((payment: any) => payment.status)
        .filter(
          (status: any) =>
            typeof status === "string" && status.length > 0
        )

      if (paymentStatuses.length > 0) {
        return [...new Set(paymentStatuses)]
          .map(formatStatus)
          .join(", ")
      }

      return "Not available"
    }

    // Derive fulfillment status without assuming that a created
    // fulfillment means the order has been delivered.
    const getFulfillmentStatus = (): string => {
      const orderStatus = order.fulfillment_status

      if (typeof orderStatus === "string" && orderStatus.length > 0) {
        return formatStatus(orderStatus)
      }

      const fulfillments = order.fulfillments || []

      if (fulfillments.length === 0) {
        return "Not fulfilled"
      }

      const statuses = fulfillments
        .map((fulfillment: any) => {
          if (fulfillment.delivered_at) return "Delivered"
          if (fulfillment.shipped_at) return "Shipped"
          if (fulfillment.canceled_at) return "Canceled"
          return fulfillment.status || "Created"
        })
        .filter(Boolean)

      return [...new Set(statuses)]
        .map(formatStatus)
        .join(", ")
    }

    const paymentStatus = getPaymentStatus()
    const fulfillmentStatus = getFulfillmentStatus()

    const addressText = (address: any): string => {
      if (!address) {
        return "Not provided"
      }

      return [
        [address.first_name, address.last_name]
          .filter(Boolean)
          .join(" "),
        address.address_1,
        address.address_2,
        address.city,
        address.state,
        address.postal_code,
        address.country_code?.toUpperCase(),
        address.phone,
      ]
        .filter(Boolean)
        .join("\n")
    }

    const customerName = [
      order.customer?.first_name,
      order.customer?.last_name,
    ]
      .filter(Boolean)
      .join(" ") || "Customer"

    const items = order.items || []

    const itemRows = items.map((item: any) => [
      item.title || "Product",
      item.variant_title || "-",
      item.variant_sku || "-",
      String(item.quantity ?? 0),
      money(item.unit_price),
      money(item.total),
    ])

    const subtotal = order.subtotal ?? order.item_subtotal ?? 0
    const discount = order.discount_total ?? 0
    const shipping = order.shipping_total ?? 0
    const tax = order.tax_total ?? 0
    const total = order.total ?? 0

    const shippingMethod =
      order.shipping_methods?.[0]?.name || "Not provided"

    const docDefinition: TDocumentDefinitions = {
      content: [
        {
          text: "INVOICE",
          style: "header",
        },
        {
          text: "Prasanth_Store",
          style: "companyName",
          alignment: "center",
        },
        {
          text: "Invoice Information",
          style: "sectionHeader",
        },
        {
          columns: [
            [
              { text: `Invoice No: INV-${order.display_id ?? "-"}` },
              { text: `Order ID: ${order.id}` },
              {
                text: `Date: ${order.created_at
                  ? new Date(order.created_at).toLocaleDateString()
                  : "Not available"}`,
              },
            ],
            [
              {
                text: `Currency: ${currency}`,
                alignment: "right",
              },
              {
                text: `Payment: ${paymentStatus}`,
                alignment: "right",
              },
              {
                text: `Fulfillment: ${fulfillmentStatus}`,
                alignment: "right",
              },
            ],
          ],
          margin: [0, 10, 0, 15],
        },
        {
          columns: [
            {
              width: "50%",
              stack: [
                {
                  text: "Customer Details",
                  style: "sectionHeader",
                },
                {
                  text: customerName,
                  bold: true,
                },
                {
                  text: order.email || "Email not provided",
                  margin: [0, 4, 0, 0],
                },
                {
                  text:
                    order.customer?.phone ||
                    order.shipping_address?.phone ||
                    "Phone not provided",
                  margin: [0, 4, 0, 0],
                },
              ],
            },
            {
              width: "50%",
              stack: [
                {
                  text: "Shipping Method",
                  style: "sectionHeader",
                },
                {
                  text: shippingMethod,
                  bold: true,
                },
              ],
            },
          ],
          margin: [0, 0, 0, 15],
        },
        {
          columns: [
            {
              width: "50%",
              stack: [
                {
                  text: "Billing Address",
                  style: "sectionHeader",
                },
                {
                  text: addressText(order.billing_address),
                },
              ],
            },
            {
              width: "50%",
              stack: [
                {
                  text: "Shipping Address",
                  style: "sectionHeader",
                },
                {
                  text: addressText(order.shipping_address),
                },
              ],
            },
          ],
          margin: [0, 0, 0, 20],
        },
        {
          text: "Order Items",
          style: "sectionHeader",
        },
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "auto", "auto", "auto", "auto"],
            body: [
              [
                { text: "Product", bold: true },
                { text: "Variant", bold: true },
                { text: "SKU", bold: true },
                { text: "Qty", bold: true },
                { text: "Unit Price", bold: true },
                { text: "Total", bold: true },
              ],
              ...(itemRows.length
                ? itemRows
                : [["No items", "-", "-", "0", money(0), money(0)]]),
            ],
          },
          layout: "lightHorizontalLines",
          margin: [0, 5, 0, 20],
        },
        {
          text: "Price Summary",
          style: "sectionHeader",
        },
        {
          table: {
            widths: ["*", "auto"],
            body: [
              ["Subtotal", money(subtotal)],
              ["Discount", `- ${money(discount)}`],
              ["Shipping", money(shipping)],
              ["Tax", money(tax)],
              [
                { text: "Grand Total", bold: true, fontSize: 14 },
                { text: money(total), bold: true, fontSize: 14 },
              ],
            ],
          },
          layout: "lightHorizontalLines",
          margin: [0, 5, 0, 20],
        },
        {
          text: "Payment & Fulfillment",
          style: "sectionHeader",
        },
        {
          table: {
            widths: ["*", "*"],
            body: [
              ["Payment Status", paymentStatus],
              ["Fulfillment Status", fulfillmentStatus],
              ["Shipping Method", shippingMethod],
            ],
          },
          layout: "lightHorizontalLines",
          margin: [0, 5, 0, 20],
        },
        {
          text: "Thank you for your order!",
          alignment: "center",
          margin: [0, 20, 0, 0],
          italics: true,
        },
      ],
      styles: {
        header: {
          fontSize: 26,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 5],
        },
        companyName: {
          fontSize: 16,
          bold: true,
          margin: [0, 0, 0, 20],
        },
        sectionHeader: {
          fontSize: 13,
          bold: true,
          margin: [0, 8, 0, 6],
        },
      },
      defaultStyle: {
        font: "Roboto",
        fontSize: 10,
      },
    }

    const pdf = pdfmake.createPdf(docDefinition)
    const buffer = await pdf.getBuffer()

    return buffer
  }
}

export default InvoiceGeneratorService