
import { HttpTypes } from "@medusajs/types"
import { clx } from "@modules/common/components/ui"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value)

  return (
    <div className="flex min-w-0 flex-col gap-y-3">
      <span className="text-sm font-semibold text-gray-800">
        Select {title}
      </span>

      <div
        className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3"
        data-testid={dataTestId}
      >
        {filteredOptions.map((value) => {
          const isSelected = value === current

          return (
            <button
              type="button"
              onClick={() => updateOption(option.id, value)}
              key={value}
              className={clx(
                "flex min-h-11 min-w-0 items-center justify-center rounded-xl border px-3 py-2 text-center text-sm font-medium transition-all duration-200",
                "break-words focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2",
                {
                  "border-violet-600 bg-violet-50 text-violet-700 shadow-sm":
                    isSelected,
                  "border-gray-200 bg-white text-gray-700 hover:border-violet-400 hover:bg-violet-50":
                    !isSelected,
                  "cursor-not-allowed opacity-50": disabled,
                }
              )}
              disabled={disabled}
              aria-pressed={isSelected}
              data-testid="option-button"
            >
              {value}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
