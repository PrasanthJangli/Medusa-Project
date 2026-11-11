
import { Container, Heading, Text } from "@modules/common/components/ui"

import { isStripeLike, paymentInfoMap } from "@lib/constants"
import Divider from "@modules/common/components/divider"
import { convertToLocale } from "@lib/util/money"
import { getUiLocale } from "@lib/data/ui-locale-actions"
import { HttpTypes } from "@medusajs/types"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const translations = {
  en: {
    payment: "Payment",
    paymentMethod: "Payment method",
    paymentDetails: "Payment details",
    paidAt: "paid at",
  },
  te: {
    payment: "చెల్లింపు",
    paymentMethod: "చెల్లింపు విధానం",
    paymentDetails: "చెల్లింపు వివరాలు",
    paidAt: "చెల్లించిన సమయం",
  },
  hi: {
    payment: "भुगतान",
    paymentMethod: "भुगतान का तरीका",
    paymentDetails: "भुगतान विवरण",
    paidAt: "भुगतान का समय",
  },
}

const PaymentDetails = async ({ order }: PaymentDetailsProps) => {
  const locale = await getUiLocale()

  const normalizedLocale: "en" | "te" | "hi" =
    locale === "te" || locale === "hi" ? locale : "en"

  const t = translations[normalizedLocale]

  const payment = order.payment_collections?.[0]?.payments?.[0]

  return (
    <div>
      <Heading level="h2" className="flex flex-row text-3xl-regular my-6">
        {t.payment}
      </Heading>

      <div>
        {payment && (
          <div className="flex flex-col small:flex-row items-start gap-4 w-full">
            <div className="flex flex-col w-full small:w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                {t.paymentMethod}
              </Text>

              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method"
              >
                {paymentInfoMap[payment.provider_id]?.title ??
                  payment.provider_id}
              </Text>
            </div>

            <div className="flex flex-col w-full small:w-2/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                {t.paymentDetails}
              </Text>

              <div className="flex gap-2 txt-medium text-ui-fg-subtle items-center">
                <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                  {paymentInfoMap[payment.provider_id]?.icon}
                </Container>

                <Text data-testid="payment-amount">
                  {isStripeLike(payment.provider_id) &&
                  payment.data?.card_last4
                    ? `**** **** **** ${payment.data.card_last4}`
                    : `${convertToLocale({
                        amount: payment.amount,
                        currency_code: order.currency_code,
                      })} ${t.paidAt} ${new Date(
                        payment.created_at ?? ""
                      ).toLocaleString(
                        normalizedLocale === "te"
                          ? "te-IN"
                          : normalizedLocale === "hi"
                            ? "hi-IN"
                            : "en-IN"
                      )}`}
                </Text>
              </div>
            </div>
          </div>
        )}
      </div>

      <Divider className="mt-8" />
    </div>
  )
}

export default PaymentDetails
