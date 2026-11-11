
import { convertToLocale } from "@lib/util/money"
import { getUiLocale } from "@lib/data/ui-locale-actions"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@modules/common/components/ui"

import Divider from "@modules/common/components/divider"

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const translations = {
  en: {
    delivery: "Delivery",
    shippingAddress: "Shipping Address",
    contact: "Contact",
    method: "Method",
  },
  te: {
    delivery: "డెలివరీ వివరాలు",
    shippingAddress: "డెలివరీ చిరునామా",
    contact: "సంప్రదింపు వివరాలు",
    method: "డెలివరీ విధానం",
  },
  hi: {
    delivery: "डिलीवरी विवरण",
    shippingAddress: "डिलीवरी का पता",
    contact: "संपर्क विवरण",
    method: "डिलीवरी का तरीका",
  },
}

const ShippingDetails = async ({ order }: ShippingDetailsProps) => {
  const locale = await getUiLocale()

  const normalizedLocale: "en" | "te" | "hi" =
    locale === "te" || locale === "hi" ? locale : "en"

  const t = translations[normalizedLocale]

  return (
    <div>
      <Heading level="h2" className="flex flex-row text-3xl-regular my-6">
        {t.delivery}
      </Heading>

      <div className="flex flex-col small:flex-row items-start gap-6">
        <div
          className="flex flex-col w-full small:w-1/3"
          data-testid="shipping-address-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-1">
            {t.shippingAddress}
          </Text>

          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address?.first_name}{" "}
            {order.shipping_address?.last_name}
          </Text>

          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address?.address_1}{" "}
            {order.shipping_address?.address_2}
          </Text>

          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address?.postal_code},{" "}
            {order.shipping_address?.city}
          </Text>

          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address?.country_code?.toUpperCase()}
          </Text>
        </div>

        <div
          className="flex flex-col w-full small:w-1/3"
          data-testid="shipping-contact-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-1">
            {t.contact}
          </Text>

          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address?.phone}
          </Text>

          <Text className="txt-medium text-ui-fg-subtle">
            {order.email}
          </Text>
        </div>

        <div
          className="flex flex-col w-full small:w-1/3"
          data-testid="shipping-method-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-1">
            {t.method}
          </Text>

          <Text className="txt-medium text-ui-fg-subtle">
            {(order.shipping_methods?.[0] as { name?: string })?.name} (
            {convertToLocale({
              amount: order.shipping_methods?.[0]?.total ?? 0,
              currency_code: order.currency_code,
            })}
            )
          </Text>
        </div>
      </div>

      <Divider className="mt-8" />
    </div>
  )
}

export default ShippingDetails
