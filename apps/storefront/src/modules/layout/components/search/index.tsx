
"use client"

import { MagnifyingGlass } from "@medusajs/icons"
import { useCallback, useEffect, useRef, useState } from "react"
import type { SearchClient } from "instantsearch.js"
import {
  Configure,
  InstantSearch,
  useHits,
  useInstantSearch,
  useSearchBox,
} from "react-instantsearch"

import useSearchSettled from "@lib/hooks/use-search-settled"
import { PRODUCT_INDEX_NAME, searchClient } from "@lib/search-client"
import { Text } from "@modules/common/components/ui"
import SearchHit, { ProductHit } from "./hit"

const HITS_PER_PAGE = 12
const DEBOUNCE_MS = 250

const searchTranslations = {
  en: {
    placeholder: "Search products",
    searchLabel: "Search products",
    submit: "Submit product search",
    searching: "Searching...",
    error: "Could not search products",
    noResults: "No products found for",
  },
  te: {
    placeholder: "ఉత్పత్తులను వెతకండి",
    searchLabel: "ఉత్పత్తులను వెతకండి",
    submit: "ఉత్పత్తుల కోసం వెతకండి",
    searching: "వెతుకుతోంది...",
    error: "ఉత్పత్తుల కోసం వెతకడం సాధ్యం కాలేదు",
    noResults: "ఉత్పత్తులు కనుగొనబడలేదు:",
  },
  hi: {
    placeholder: "उत्पाद खोजें",
    searchLabel: "उत्पाद खोजें",
    submit: "उत्पाद खोजें",
    searching: "खोज रहे हैं...",
    error: "उत्पादों को खोजा नहीं जा सका",
    noResults: "कोई उत्पाद नहीं मिला:",
  },
}

type UiLocale = "en" | "te" | "hi"

const SearchPanel = ({ locale }: { locale: UiLocale }) => {
  const timer = useRef<number | undefined>(undefined)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const labels = searchTranslations[locale]

  const queryHook = useCallback(
    (nextQuery: string, search: (value: string) => void) => {
      window.clearTimeout(timer.current)

      timer.current = window.setTimeout(() => {
        search(nextQuery)
      }, DEBOUNCE_MS)
    },
    []
  )

  const { query, refine } = useSearchBox({ queryHook })
  const { items } = useHits<ProductHit>()
  const { status, error } = useInstantSearch()
  const { isSettled } = useSearchSettled()

  const [inputValue, setInputValue] = useState(query)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    return () => {
      window.clearTimeout(timer.current)
    }
  }, [])

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    document.addEventListener("touchstart", handleOutsideClick)

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
      document.removeEventListener("touchstart", handleOutsideClick)
    }
  }, [])

  const hasInput = Boolean(inputValue.trim())
  const isPending = inputValue.trim() !== query.trim()
  const hasResults = Boolean(query.trim()) && items.length > 0
  const showDropdown = isFocused && hasInput

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    window.clearTimeout(timer.current)
    refine(inputValue.trim())
    inputRef.current?.blur()
    setIsFocused(false)
  }

  return (
    <div ref={containerRef} className="relative w-full min-w-0">
      <form
        role="search"
        onSubmit={handleSubmit}
        className="flex h-10 w-full min-w-0 overflow-hidden rounded-md bg-white ring-1 ring-gray-300 transition focus-within:ring-2 focus-within:ring-[#febd69] sm:h-11"
      >
        <input
          ref={inputRef}
          type="search"
          value={inputValue}
          onFocus={() => setIsFocused(true)}
          onChange={(event) => {
            const value = event.target.value

            setInputValue(value)
            refine(value)
            setIsFocused(true)
          }}
          placeholder={labels.placeholder}
          aria-label={labels.searchLabel}
          aria-expanded={showDropdown}
          aria-controls="product-search-results"
          autoComplete="off"
          className="min-w-0 flex-1 border-0 bg-white px-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:ring-0 sm:px-4"
          data-testid="search-input"
        />

        <button
          type="submit"
          aria-label={labels.submit}
          className="flex h-full w-10 shrink-0 items-center justify-center bg-[#febd69] text-gray-900 transition hover:bg-[#f3a847] sm:w-12"
          data-testid="nav-search-button"
        >
          <MagnifyingGlass className="h-5 w-5" />
        </button>
      </form>

      {showDropdown && (
        <div
          id="product-search-results"
          className="absolute left-0 right-0 top-full z-[80] mt-1 max-h-[65dvh] w-full overflow-x-hidden overflow-y-auto rounded-md border border-gray-200 bg-white text-gray-900 shadow-xl sm:max-h-[70vh]"
        >
          {!query.trim() || isPending ? (
            <Text className="px-3 py-4 text-sm text-gray-500 sm:px-4">
              {labels.searching}
            </Text>
          ) : status === "error" ? (
            <Text className="break-words px-3 py-4 text-sm text-red-600 sm:px-4">
              {labels.error}
              {error?.message ? `: ${error.message}` : "."}
            </Text>
          ) : !isSettled ? (
            <Text className="px-3 py-4 text-sm text-gray-500 sm:px-4">
              {labels.searching}
            </Text>
          ) : hasResults ? (
            <ul className="py-2" data-testid="search-results">
              {items.map((hit) => (
                <SearchHit
                  key={hit.objectID}
                  hit={hit}
                  onNavigate={() => setIsFocused(false)}
                />
              ))}
            </ul>
          ) : (
            <Text
              className="break-words px-3 py-4 text-sm text-gray-500 sm:px-4"
              data-testid="search-no-results"
            >
              {labels.noResults} &quot;{query}&quot;
            </Text>
          )}
        </div>
      )}
    </div>
  )
}

const Search = ({ locale = "en" }: { locale?: string }) => {
  const supportedLocale: UiLocale =
    locale === "te" || locale === "hi" ? locale : "en"

  return (
    <InstantSearch
      indexName={PRODUCT_INDEX_NAME}
      searchClient={searchClient as unknown as SearchClient}
      future={{ preserveSharedStateOnUnmount: true }}
    >
      <Configure hitsPerPage={HITS_PER_PAGE} />
      <SearchPanel locale={supportedLocale} />
    </InstantSearch>
  )
}

export default Search
