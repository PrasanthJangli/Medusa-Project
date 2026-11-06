
"use client"

import { MagnifyingGlass, XMarkMini } from "@medusajs/icons"
import { useTranslations } from "next-intl"
import { useCallback, useEffect, useRef, useState } from "react"
import { useSearchBox } from "react-instantsearch"

const DEBOUNCE_MS = 250

/**
 * Free-text search over the listing, refining the same InstantSearch state the
 * sidebar filters do. The input is held locally so typing stays responsive
 * while the query itself is debounced.
 */
const StoreSearchBox = () => {
  const t = useTranslations("Store")
  const timer = useRef<number | undefined>(undefined)

  const queryHook = useCallback(
    (nextQuery: string, search: (value: string) => void) => {
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => search(nextQuery), DEBOUNCE_MS)
    },
    []
  )

  const { query, refine } = useSearchBox({ queryHook })
  const [inputValue, setInputValue] = useState(query)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Follow the query when it changes elsewhere.
  useEffect(() => {
    setInputValue(query)
  }, [query])

  const clear = () => {
    window.clearTimeout(timer.current)
    setInputValue("")
    refine("")
  }

  return (
    <div className="mb-6 flex items-center gap-x-3 border-b border-ui-border-base">
      <MagnifyingGlass className="shrink-0 text-ui-fg-muted" />

      <input
        type="search"
        value={inputValue}
        onChange={(event) => {
          setInputValue(event.target.value)
          refine(event.target.value)
        }}
        placeholder={t("searchProducts")}
        aria-label={t("searchProducts")}
        className="txt-medium w-full bg-transparent py-3 text-ui-fg-base outline-none placeholder:text-ui-fg-muted [&::-webkit-search-cancel-button]:hidden"
        data-testid="store-search-input"
      />

      {inputValue && (
        <button
          type="button"
          onClick={clear}
          aria-label={t("clearSearch")}
          className="shrink-0 text-ui-fg-muted hover:text-ui-fg-base"
          data-testid="store-search-clear"
        >
          <XMarkMini />
        </button>
      )}
    </div>
  )
}

export default StoreSearchBox
