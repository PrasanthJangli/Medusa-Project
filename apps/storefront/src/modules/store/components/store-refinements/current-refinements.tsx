
"use client"

import { XMarkMini } from "@medusajs/icons"
import { useTranslations } from "next-intl"
import {
  useClearRefinements,
  useCurrentRefinements,
} from "react-instantsearch"

import { indexedCurrency, priceAttribute } from "@lib/search-client"
import { convertToLocale } from "@lib/util/money"
import {
  CATEGORY_ATTRIBUTE,
  LABELS_ATTRIBUTE,
  OPTION_VALUES_ATTRIBUTE,
} from "./attributes"

type Refinement = ReturnType<
  typeof useCurrentRefinements
>["items"][number]["refinements"][number]

type RefinementLabels = {
  category: string
  label: string
  upTo: string
  from: string
}

function refinementLabel(
  refinement: Refinement,
  currencyCode: string,
  translations: RefinementLabels
) {
  const { attribute, label, value, operator } = refinement

  if (attribute === OPTION_VALUES_ATTRIBUTE) {
    const separator = String(value).indexOf(":")

    return separator < 1
      ? label
      : `${String(value).slice(0, separator)}: ${String(
          value
        ).slice(separator + 1)}`
  }

  if (attribute === priceAttribute("min_price", currencyCode)) {
    const amount = convertToLocale({
      amount: Number(value),
      currency_code: indexedCurrency(currencyCode),
      maximumFractionDigits: 0,
    })

    return operator === "<=" || operator === "<"
      ? `${translations.upTo} ${amount}`
      : `${translations.from} ${amount}`
  }

  if (attribute === CATEGORY_ATTRIBUTE) {
    return `${translations.category}: ${label}`
  }

  if (attribute === LABELS_ATTRIBUTE) {
    return `${translations.label}: ${label}`
  }

  return label
}

const CurrentRefinements = ({
  currencyCode,
}: {
  currencyCode: string
}) => {
  const t = useTranslations("Store")

  const { items, refine } = useCurrentRefinements()

  const {
    canRefine: canClearAll,
    refine: clearAll,
  } = useClearRefinements()

  const refinements = items.flatMap(
    (item) => item.refinements
  )

  if (!refinements.length) {
    return null
  }

  const translations: RefinementLabels = {
    category: t("category"),
    label: t("label"),
    upTo: t("upTo"),
    from: t("from"),
  }

  return (
    <section
      className="flex min-w-0 flex-col gap-y-3"
      data-testid="current-refinements"
      aria-label={t("appliedFilters")}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-semibold text-gray-700">
          {t("appliedFilters")}
          <span className="ml-1 text-xs text-gray-500">
            ({refinements.length})
          </span>
        </span>

        {canClearAll && (
          <button
            type="button"
            onClick={clearAll}
            className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800 hover:underline"
            data-testid="clear-refinements"
          >
            {t("clearAll")}
          </button>
        )}
      </div>

      <ul className="flex flex-wrap gap-2">
        {refinements.map((refinement) => {
          const label = refinementLabel(
            refinement,
            currencyCode,
            translations
          )

          return (
            <li
              key={`${refinement.attribute}:${refinement.operator ?? ""}:${refinement.value}`}
              className="max-w-full"
            >
              <button
                type="button"
                onClick={() => refine(refinement)}
                aria-label={`${t("removeFilter")} ${label}`}
                className="inline-flex max-w-full items-center gap-1.5 break-words rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-800 transition-colors hover:border-blue-400 hover:bg-blue-100"
                data-testid="remove-refinement"
              >
                <span className="break-words">{label}</span>
                <XMarkMini className="h-4 w-4 shrink-0" />
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default CurrentRefinements

