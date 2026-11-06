
"use client"

import { useTranslations } from "next-intl"
import { useSortBy } from "react-instantsearch"

import FilterRadioGroup from "@modules/common/components/filter-radio-group"
import {
  CATEGORY_ATTRIBUTE,
  LABELS_ATTRIBUTE,
  getSortOptions,
} from "./attributes"
import CurrentRefinements from "./current-refinements"
import OnSaleToggle from "./on-sale-toggle"
import OptionRefinements from "./option-refinements"
import PriceRange from "./price-range"
import RefinementGroup from "./refinement-group"

const SortProducts = ({
  currencyCode,
}: {
  currencyCode: string
}) => {
  const t = useTranslations("Store")

  const items = getSortOptions(currencyCode, {
    relevance: t("relevance"),
    latestArrivals: t("latestArrivals"),
    priceLowToHigh: t("priceLowToHigh"),
    priceHighToLow: t("priceHighToLow"),
    titleAToZ: t("titleAToZ"),
    titleZToA: t("titleZToA"),
  })

  const { currentRefinement, refine } = useSortBy({ items })

  return (
    <section className="border-b border-gray-200 pb-5">
      <h3 className="mb-3 text-sm font-bold text-[#0f1111]">
        {t("sortProducts")}
      </h3>

      <FilterRadioGroup
        title={t("sortBy")}
        items={items}
        value={currentRefinement}
        handleChange={refine}
        data-testid="sort-by-container"
      />
    </section>
  )
}

const StoreRefinements = ({
  currencyCode,
}: {
  currencyCode: string
}) => {
  const t = useTranslations("Store")

  return (
    <aside
      aria-label={t("productFilters")}
      className="w-full rounded-xl border border-gray-200 bg-white p-4 text-[#0f1111] shadow-sm sm:p-5"
    >
      <div className="mb-5 flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight">
            {t("filters")}
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            {t("findProducts")}
          </p>
        </div>

        <span
          aria-hidden="true"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-lg"
        >
          ⚙
        </span>
      </div>

      <SortProducts currencyCode={currencyCode} />

      <section className="border-b border-gray-200 py-5">
        <CurrentRefinements currencyCode={currencyCode} />
      </section>

      <section className="border-b border-gray-200 py-5">
        <OptionRefinements />
      </section>

      <section className="border-b border-gray-200 py-5">
        <PriceRange currencyCode={currencyCode} />
      </section>

      <section className="border-b border-gray-200 py-5">
        <OnSaleToggle />
      </section>

      <section className="border-b border-gray-200 py-5">
        <RefinementGroup
          attribute={CATEGORY_ATTRIBUTE}
          title={t("category")}
        />
      </section>

      <section className="pt-5">
        <RefinementGroup
          attribute={LABELS_ATTRIBUTE}
          title={t("labels")}
        />
      </section>
    </aside>
  )
}

export default StoreRefinements
