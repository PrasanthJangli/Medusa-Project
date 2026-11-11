
"use client"

import * as Accordion from "@radix-ui/react-accordion"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"

import { ChevronDownMini } from "@medusajs/icons"
import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import clsx from "clsx"

type OptionsPickerProps = {
  selectedValueIds: string[]
  setOptionValueIds: (valueIds: string[]) => void
}

const normalizeKey = (value: string) =>
  value.trim().toLowerCase().replace(/[^a-z0-9]/g, "")

const optionTranslationKeys: Record<string, string> = {
  color: "color",
  colors: "color",
  colour: "color",
  colours: "color",
  size: "size",
  sizes: "size",
  option: "options",
  options: "options",
}

const valueTranslationKeys: Record<string, string> = {
  black: "black",
  white: "white",
  red: "red",
  blue: "blue",
  green: "green",
  yellow: "yellow",
  pink: "pink",
  orange: "orange",
  purple: "purple",
  grey: "grey",
  gray: "grey",
  brown: "brown",

  shirts: "shirts",
  shirt: "shirts",
  pants: "pants",
  shorts: "shorts",
  tshirts: "tshirts",
  tshirt: "tshirts",
  shoes: "shoes",
  shoe: "shoes",
}

const OptionsPicker = ({
  selectedValueIds,
  setOptionValueIds,
}: OptionsPickerProps) => {
  const t = useTranslations("Store")

  const [options, setOptions] = useState<HttpTypes.StoreProductOption[]>([])
  const [openItems, setOpenItems] = useState<string[]>([])

  const translateOption = (
    value: string,
    type: "option" | "value"
  ): string => {
    const key = normalizeKey(value)

    const translationKey =
      type === "option"
        ? optionTranslationKeys[key]
        : valueTranslationKeys[key]

    if (!translationKey) {
      return value
    }

    return t(translationKey as any)
  }

  useEffect(() => {
    let isMounted = true

    const fetchOptions = async () => {
      try {
        const response = await sdk.client.fetch<{
          product_options?: HttpTypes.StoreProductOption[]
        }>("/store/product-options", {
          method: "GET",
          query: {
            is_exclusive: false,
            fields: "*values",
          },
        })

        const productOptions = response?.product_options || []

        console.log(
          "PRODUCT OPTION DETAILS:",
          productOptions.map((option) => ({
            id: option.id,
            title: option.title,
            normalizedTitle: normalizeKey(option.title || ""),
            values: option.values?.map((value) => ({
              id: value.id,
              value: value.value,
              normalizedValue: normalizeKey(value.value || ""),
            })),
          }))
        )

        if (isMounted) {
          setOptions(productOptions)
          setOpenItems(productOptions.map((option) => option.id))
        }
      } catch (error) {
        console.error("OPTIONS API ERROR:", error)
      }
    }

    fetchOptions()

    return () => {
      isMounted = false
    }
  }, [])

  if (!options.length) {
    return null
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between px-1">
        <span className="txt-compact-small-plus text-ui-fg-subtle">
          {t("options")}
        </span>
      </div>

      <Accordion.Root
        type="multiple"
        value={openItems}
        onValueChange={(values) => setOpenItems(values as string[])}
        className="flex flex-col gap-y-3 pr-6"
      >
        {options.map((option) => {
          const values =
            option.values
              ?.map((value) => ({
                id: value.id,
                label: value.value,
              }))
              .filter(
                (value): value is { id: string; label: string } =>
                  !!value.id && !!value.label
              ) || []

          if (!values.length) {
            return null
          }

          const toggleValue = (valueId: string) => {
            const isSelected = selectedValueIds.includes(valueId)

            const nextSelections = isSelected
              ? selectedValueIds.filter((id) => id !== valueId)
              : [...selectedValueIds, valueId]

            setOptionValueIds(Array.from(new Set(nextSelections)))
          }

          const isOpen = openItems.includes(option.id)

          const selectedCount = values.filter((value) =>
            selectedValueIds.includes(value.id)
          ).length

          return (
            <Accordion.Item
              key={option.id}
              value={option.id}
              className="overflow-hidden"
            >
              <Accordion.Header>
                <Accordion.Trigger className="flex w-full items-center justify-between py-3 text-left">
                  <div className="flex items-center gap-2">
                    <span className="txt-compact-small-plus text-ui-fg-base">
                      {translateOption(option.title || "Option", "option")}
                    </span>

                    <span className="txt-compact-small-plus text-ui-fg-muted">
                      ({selectedCount})
                    </span>
                  </div>

                  <span
                    className={clsx(
                      "flex h-7 w-7 items-center justify-center text-ui-fg-muted transition-transform duration-150",
                      {
                        "rotate-180": isOpen,
                      }
                    )}
                  >
                    <ChevronDownMini />
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>

              <Accordion.Content className="pb-4 pt-1">
                <div className="flex flex-wrap gap-2">
                  {values.map((value) => {
                    const isSelected = selectedValueIds.includes(value.id)

                    return (
                      <button
                        key={value.id}
                        type="button"
                        onClick={() => toggleValue(value.id)}
                        className={clsx(
                          "border-ui-border-base border text-small-regular h-10 rounded-rounded px-3 flex items-center transition-colors duration-150",
                          {
                            "border-ui-border-interactive text-ui-fg-base":
                              isSelected,
                            "text-ui-fg-muted hover:text-ui-fg-base":
                              !isSelected,
                          }
                        )}
                        aria-pressed={isSelected}
                      >
                        {translateOption(value.label, "value")}
                      </button>
                    )
                  })}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          )
        })}
      </Accordion.Root>
    </div>
  )
}

export default OptionsPicker
