"use client"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: string) => void
  "data-testid"?: string
}

const sortOptions: {
  value: SortOptions
  label: string
  description: string
  icon: string
}[] = [
  {
    value: "created_at",
    label: "Latest Arrivals",
    description: "Show newest products first",
    icon: "◷",
  },
  {
    value: "price_asc",
    label: "Price: Low to High",
    description: "Start with lower prices",
    icon: "↑",
  },
  {
    value: "price_desc",
    label: "Price: High to Low",
    description: "Start with higher prices",
    icon: "↓",
  },
]

const SortProducts = ({
  sortBy,
  setQueryParams,
  "data-testid": dataTestId,
}: SortProductsProps) => {
  return (
    <aside
      className="w-full min-w-0 max-w-none shrink-0 self-start lg:max-w-[280px]"
      data-testid={dataTestId}
    >
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg shadow-gray-200/40">
        <div className="flex items-center gap-3 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-white px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-2xl text-white shadow-md shadow-violet-200">
            ⇅
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-gray-900">
              Sort Products
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Find your perfect pick
            </p>
          </div>
        </div>

        <div className="p-3 sm:p-4">
          <p className="mb-3 px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
            Choose order
          </p>

          <div className="flex flex-col gap-2">
            {sortOptions.map((option) => {
              const selected = sortBy === option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setQueryParams("sortBy", option.value)}
                  className={`flex w-full min-w-0 items-center gap-2 rounded-xl border p-3 text-left transition-all duration-200 sm:gap-3 sm:p-3.5 ${
                    selected
                      ? "border-violet-300 bg-violet-50 shadow-sm"
                      : "border-transparent bg-gray-50 hover:border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl font-semibold ${
                      selected
                        ? "bg-violet-600 text-white"
                        : "bg-white text-gray-600"
                    }`}
                  >
                    {option.icon}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-sm font-semibold ${
                        selected ? "text-violet-800" : "text-gray-800"
                      }`}
                    >
                      {option.label}
                    </span>

                    <span className="mt-1 block text-xs leading-4 text-gray-500">
                      {option.description}
                    </span>
                  </span>

                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      selected
                        ? "border-violet-600 bg-violet-600 text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {selected && (
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      >
                        <path
                          d="m5 10 3 3 7-7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="text-xs leading-5 text-gray-500">
              Choose how you want to explore the products.
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default SortProducts