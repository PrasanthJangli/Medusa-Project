
"use client"

import clsx from "clsx"
import { useTranslations } from "next-intl"
import { useRefinementList } from "react-instantsearch"

type RefinementGroupProps = {
  attribute: string
  title: string
}

const RefinementGroup = ({ attribute, title }: RefinementGroupProps) => {
  const t = useTranslations("Store")

  const { items, refine } = useRefinementList({
    attribute,
    limit: 20,
    sortBy: ["count:desc", "name:asc"],
  })

  const translateLabel = (label: string) => {
    const normalized = label.toLowerCase().trim().replace(/[\s_-]+/g, "")

    const translations: Record<string, string> = {
      pants: "pants",
      shirts: "shirts",
      shirt: "shirts",
      shorts: "shorts",
      tshirts: "tshirts",
      tshirt: "tshirts",
      shoes: "shoes",
      shoe: "shoes",
    }

    const translationKey = translations[normalized]

    return translationKey ? t(translationKey) : label
  }

  if (!items.length) {
    return null
  }

  return (
    <div className="flex flex-col gap-y-3">
      <span className="txt-compact-small-plus text-ui-fg-subtle">
        {title}
      </span>

      <ul className="flex flex-col gap-y-2 pr-6">
        {items.map((item) => (
          <li key={item.value}>
            <label className="flex cursor-pointer items-start gap-x-2">
              <input
                type="checkbox"
                checked={item.isRefined}
                onChange={() => refine(item.value)}
                className="mt-1 shrink-0 accent-ui-fg-interactive"
                data-testid={`refinement-${attribute}`}
              />

              <span
                className={clsx("text-small-regular min-w-0 break-words", {
                  "text-ui-fg-base": item.isRefined,
                  "text-ui-fg-subtle": !item.isRefined,
                })}
              >
                {translateLabel(item.label)}
              </span>

              <span className="text-small-regular shrink-0 text-ui-fg-muted">
                ({item.count})
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RefinementGroup
