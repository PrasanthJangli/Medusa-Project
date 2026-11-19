
"use client"

import { useLocale } from "next-intl"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@modules/common/components/ui"

type LineItemOptionsProps = {
  variant: HttpTypes.StoreProductVariant | undefined
  "data-testid"?: string
  "data-value"?: HttpTypes.StoreProductVariant
}

const LineItemOptions = ({
  variant,
  "data-testid": dataTestid,
  "data-value": dataValue,
}: LineItemOptionsProps) => {
  const locale = useLocale()

  const variantLabel =
    locale === "te"
      ? "వేరియంట్"
      : locale === "hi"
        ? "वेरिएंट"
        : "Variant"

  return (
    <Text
      data-testid={dataTestid}
      data-value={dataValue}
      className="inline-block txt-medium text-ui-fg-subtle w-full overflow-hidden text-ellipsis"
    >
      {variantLabel}: {variant?.title}
    </Text>
  )
}

export default LineItemOptions
