
"use client"

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
  const items = getSortOptions(currencyCode)
  const { currentRefinement, refine } = useSortBy({ items })

  return (
    <section className="border-b border-gray-200 pb-5">
      <h3 className="mb-3 text-sm font-bold text-[#0f1111]">
        Sort products
      </h3>

      <FilterRadioGroup
        title="Sort by"
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
  return (
    <aside
      aria-label="Product filters"
      className="w-full rounded-xl border border-gray-200 bg-white p-4 text-[#0f1111] shadow-sm sm:p-5"
    >
      {/* Sidebar heading */}
      <div className="mb-5 flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight">
            Filters
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Find products that suit you
          </p>
        </div>

        <span
          aria-hidden="true"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-lg"
        >
          ☷
        </span>
      </div>

      {/* Sorting */}
      <SortProducts currencyCode={currencyCode} />

      {/* Selected filters */}
      <section className="border-b border-gray-200 py-5">
        <CurrentRefinements currencyCode={currencyCode} />
      </section>

      {/* Product options */}
      <section className="border-b border-gray-200 py-5">
        <OptionRefinements />
      </section>

      {/* Price filter */}
      <section className="border-b border-gray-200 py-5">
        <PriceRange currencyCode={currencyCode} />
      </section>

      {/* Sale filter */}
      <section className="border-b border-gray-200 py-5">
        <OnSaleToggle currencyCode={currencyCode} />
      </section>

      {/* Categories */}
      <section className="border-b border-gray-200 py-5">
        <RefinementGroup
          attribute={CATEGORY_ATTRIBUTE}
          title="Category"
        />
      </section>

      {/* Labels */}
      <section className="pt-5">
        <RefinementGroup
          attribute={LABELS_ATTRIBUTE}
          title="Labels"
        />
      </section>
    </aside>
  )
}

export default StoreRefinements
