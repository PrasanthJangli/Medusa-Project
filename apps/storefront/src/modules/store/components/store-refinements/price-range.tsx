
"use client"

import { RangeInput } from "react-instantsearch"
import { priceAttribute } from "@lib/search-client"

type PriceRangeProps = {
  currencyCode: string
}

const PriceRange = ({ currencyCode }: PriceRangeProps) => {
  const attribute = priceAttribute("min_price", currencyCode)

  const currencySymbol =
    currencyCode.toLowerCase() === "inr"
      ? "₹"
      : currencyCode.toUpperCase()

  return (
    <div className="flex flex-col gap-y-3">
      <div>
        <h3 className="text-sm font-bold text-[#0f1111]">
          Price Range
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          Filter products by price
        </p>
      </div>

      <div className="text-xs font-medium text-gray-600">
        Currency: {currencySymbol}
      </div>

      <RangeInput
        attribute={attribute}
        classNames={{
          root: "w-full",
          form: "flex flex-col gap-3",
          input:
            "w-full min-w-0 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-[#0f1111] outline-none focus:border-[#142f59] focus:ring-1 focus:ring-[#142f59]",
          separator: "text-xs text-gray-500",
          submit:
            "w-full rounded-md bg-[#142f59] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#102544]",
        }}
      />
    </div>
  )
}

export default PriceRange
