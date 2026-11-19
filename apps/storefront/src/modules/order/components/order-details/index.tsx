
import { HttpTypes } from "@medusajs/types"
import { Text } from "@modules/common/components/ui"
import { getUiLocale } from "@lib/data/ui-locale-actions"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const translations = {
  en: {
    confirmation:
      "We have sent the order confirmation details to",
    orderDate: "Order date:",
    orderNumber: "Order number:",
    orderStatus: "Order status:",
    paymentStatus: "Payment status:",
  },
  te: {
    confirmation:
      "మీ ఆర్డర్ నిర్ధారణ వివరాలను ఈ ఇమెయిల్‌కు పంపించాము:",
    orderDate: "ఆర్డర్ తేదీ:",
    orderNumber: "ఆర్డర్ నంబర్:",
    orderStatus: "ఆర్డర్ స్థితి:",
    paymentStatus: "చెల్లింపు స్థితి:",
  },
  hi: {
    confirmation:
      "हमने आपके ऑर्डर की पुष्टि का विवरण इस ईमेल पर भेज दिया है:",
    orderDate: "ऑर्डर की तारीख:",
    orderNumber: "ऑर्डर नंबर:",
    orderStatus: "ऑर्डर की स्थिति:",
    paymentStatus: "भुगतान की स्थिति:",
  },
}

const OrderDetails = async ({
  order,
  showStatus,
}: OrderDetailsProps) => {
  const locale = await getUiLocale()

  const normalizedLocale: "en" | "te" | "hi" =
    locale === "te" || locale === "hi" ? locale : "en"

  const t = translations[normalizedLocale]

  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ")

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  return (
    <div>
      <Text>
        {t.confirmation}{" "}
        <span
          className="text-ui-fg-medium-plus font-semibold break-all"
          data-testid="order-email"
        >
          {order.email}
        </span>
        .
      </Text>

      <Text className="mt-2">
        {t.orderDate}{" "}
        <span data-testid="order-date">
          {new Date(order.created_at).toDateString()}
        </span>
      </Text>

      <Text className="mt-2 text-ui-fg-interactive">
        {t.orderNumber}{" "}
        <span data-testid="order-id">{order.display_id}</span>
      </Text>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-compact-small">
        {showStatus && (
          <>
            <Text>
              {t.orderStatus}{" "}
              <span
                className="text-ui-fg-subtle"
                data-testid="order-status"
              >
                {formatStatus(order.fulfillment_status)}
              </span>
            </Text>

            <Text>
              {t.paymentStatus}{" "}
              <span
                className="text-ui-fg-subtle"
                data-testid="order-payment-status"
              >
                {formatStatus(order.payment_status)}
              </span>
            </Text>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
