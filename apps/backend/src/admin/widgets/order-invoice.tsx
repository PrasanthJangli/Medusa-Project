import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Heading } from "@medusajs/ui"
import {
  AdminOrder,
  DetailWidgetProps,
} from "@medusajs/framework/types"
import { sdk } from "../lib/sdk.ts"

const OrderInvoiceWidget = ({
  data: order,
}: DetailWidgetProps<AdminOrder>) => {
  const downloadInvoice = async () => {
    try {
      const response: Response = await sdk.client.fetch(
        `/admin/orders/${order.id}/invoices`,
        {
          method: "GET",
          headers: {
            accept: "application/pdf",
          },
        }
      )

      const blob = await response.blob()

      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = `invoice-${order.id}.pdf`

      document.body.appendChild(link)
      link.click()

      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
    } catch (error) {
      console.error("Failed to download invoice:", error)
    }
  }

  return (
    <div className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Invoice</Heading>

        <button
          type="button"
          onClick={() => {
            void downloadInvoice()
          }}
          className="rounded-md border px-4 py-2 text-sm font-medium"
        >
          Download Invoice
        </button>
      </div>
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details",
})

export default OrderInvoiceWidget