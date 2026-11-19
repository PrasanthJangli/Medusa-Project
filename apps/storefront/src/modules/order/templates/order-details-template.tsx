
"use client"

import { useState } from "react"
import { XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import OrderSummary from "@modules/order/components/order-summary"
import ShippingDetails from "@modules/order/components/shipping-details"

type OrderDetailsTemplateProps = {
  order: HttpTypes.StoreOrder
}

const OrderDetailsTemplate = ({
  order,
}: OrderDetailsTemplateProps) => {
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState("")

  const downloadInvoice = async () => {
    if (downloading) return

    setDownloading(true)
    setDownloadError("")

    let objectUrl: string | undefined

    try {
      const response = await fetch(`/api/invoice/${order.id}`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Invoice API Error:", response.status, errorText)
        throw new Error("Invoice download failed")
      }

      const blob = await response.blob()
      objectUrl = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = objectUrl
      link.download = `invoice-${order.id}.pdf`

      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error("Failed to download invoice:", error)
      setDownloadError(
        "Unable to download your invoice. Please try again."
      )
    } finally {
      if (objectUrl) {
        window.setTimeout(() => {
          window.URL.revokeObjectURL(objectUrl!)
        }, 1000)
      }

      setDownloading(false)
    }
  }

  return (
    <main className="min-h-screen w-full min-w-0 overflow-x-clip bg-gradient-to-b from-violet-50/80 via-white to-gray-50 py-5 sm:py-8 md:py-12">
      <div className="mx-auto flex w-full min-w-0 max-w-5xl flex-col gap-5 px-3 sm:gap-7 sm:px-6 lg:px-8">

        {/* PAGE HEADING */}
        <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-1.5 text-[10px] font-semibold text-violet-700 shadow-sm sm:text-xs">
              <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
              ORDER INFORMATION
            </div>

            <h1 className="break-words text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
              Order details
            </h1>

            <p className="max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
              View your order information, purchased items,
              shipping details, and payment summary.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:w-auto lg:shrink-0">
            {/* INVOICE DOWNLOAD */}
            <button
              type="button"
              onClick={() => void downloadInvoice()}
              disabled={downloading}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-5"
            >
              {downloading ? (
                <>
                  <svg
                    className="h-4 w-4 shrink-0 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="opacity-25"
                    />
                    <path
                      d="M21 12a9 9 0 0 0-9-9"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  Preparing PDF...
                </>
              ) : (
                <>
                  <svg
                    className="h-5 w-5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v3h14v-3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Download Invoice
                </>
              )}
            </button>

            {/* BACK TO ORDERS */}
            <LocalizedClientLink
              href="/account/orders"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 sm:w-auto"
              data-testid="back-to-overview-button"
            >
              <XMark />
              Back to orders
            </LocalizedClientLink>
          </div>
        </div>

        {/* DOWNLOAD ERROR */}
        {downloadError && (
          <div
            role="alert"
            className="break-words rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {downloadError}
          </div>
        )}

        {/* MAIN ORDER INFORMATION CARD */}
        <section
          className="w-full min-w-0 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm sm:rounded-3xl"
          data-testid="order-details-container"
        >
          {/* CARD HEADER */}
          <div className="border-b border-gray-100 bg-gradient-to-r from-violet-50 to-white px-4 py-4 sm:px-8 sm:py-5">
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-600 sm:text-xs">
                  Order reference
                </p>

                <h2 className="mt-1 break-all text-base font-bold text-gray-900 sm:text-xl">
                  {order.display_id
                    ? `Order #${order.display_id}`
                    : order.id}
                </h2>
              </div>

              <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                Order overview
              </span>
            </div>
          </div>

          {/* ORDER COMPONENTS */}
          <div className="flex min-w-0 flex-col gap-6 p-3 sm:gap-10 sm:p-6 md:p-8">

            {/* ORDER STATUS AND DETAILS */}
            <section className="min-w-0">
              <h3 className="mb-3 text-base font-bold text-gray-900 sm:mb-4 sm:text-lg">
                Order status
              </h3>

              <div className="min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50/70 p-3 sm:p-5">
                <OrderDetails order={order} showStatus />
              </div>
            </section>

            {/* PURCHASED ITEMS */}
            <section className="min-w-0">
              <h3 className="mb-3 text-base font-bold text-gray-900 sm:mb-4 sm:text-lg">
                Items in your order
              </h3>

              <div className="w-full min-w-0 overflow-x-auto overscroll-x-contain rounded-xl border border-gray-100 p-3 sm:p-5">
                <Items order={order} />
              </div>
            </section>

            {/* SHIPPING */}
            <section className="min-w-0">
              <h3 className="mb-3 text-base font-bold text-gray-900 sm:mb-4 sm:text-lg">
                Shipping information
              </h3>

              <div className="min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50/50 p-3 sm:p-5">
                <ShippingDetails order={order} />
              </div>
            </section>

            {/* PAYMENT AND SUMMARY */}
            <section className="min-w-0">
              <h3 className="mb-3 text-base font-bold text-gray-900 sm:mb-4 sm:text-lg">
                Payment and order summary
              </h3>

              <div className="min-w-0 overflow-hidden rounded-xl border border-gray-100 p-3 sm:p-5">
                <OrderSummary order={order} />
              </div>
            </section>

            {/* HELP */}
            <section className="min-w-0 border-t border-gray-100 pt-5 sm:pt-6">
              <Help />
            </section>
          </div>
        </section>

        {/* BOTTOM NOTE */}
        <p className="px-2 text-center text-xs leading-5 text-gray-400 sm:text-sm">
          Thank you for shopping with us. Keep your order details
          available for future reference.
        </p>
      </div>
    </main>
  )
}

export default OrderDetailsTemplate
