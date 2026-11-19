
"use client"

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react"
import { Fragment, useEffect, useMemo, useState } from "react"
import ReactCountryFlag from "react-country-flag"

import { StateType } from "@lib/hooks/use-toggle-state"
import { useParams, usePathname } from "next/navigation"
import { updateRegion } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"

type CountryOption = {
  country: string
  region: string
  label: string
}

type CountrySelectProps = {
  toggleState: StateType
  regions: HttpTypes.StoreRegion[]
}

const CountrySelect = ({ toggleState, regions }: CountrySelectProps) => {
  const [current, setCurrent] = useState<CountryOption | undefined>(undefined)

  const { countryCode } = useParams()
  const pathname = usePathname()
  const currentPath = pathname.split(`/${countryCode}`)[1] || ""

  const { state, close } = toggleState

  const options = useMemo(() => {
    return regions
      ?.map((r) => {
        return r.countries?.map((c) => ({
          country: c.iso_2 ?? "",
          region: r.id,
          label: c.display_name ?? "",
        }))
      })
      .flat()
      .filter((o): o is CountryOption => !!o)
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [regions])

  useEffect(() => {
    if (countryCode) {
      const option = options?.find((o) => o?.country === countryCode)
      setCurrent(option)
    }
  }, [options, countryCode])

  const handleChange = (option: CountryOption) => {
    updateRegion(option.country, currentPath)
    close()
  }

  return (
    <div className="relative w-full min-w-0">
      <Listbox
        as="span"
        onChange={handleChange}
        defaultValue={
          countryCode
            ? options?.find((o) => o?.country === countryCode)
            : undefined
        }
      >
        <ListboxButton className="w-full min-w-0 py-2 text-left">
          <div className="txt-compact-small flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <span className="shrink-0">Shipping to:</span>

            {current && (
              <span className="txt-compact-small flex min-w-0 items-center gap-x-2">
                <ReactCountryFlag
                  svg
                  style={{
                    width: "16px",
                    height: "16px",
                  }}
                  countryCode={current.country}
                />

                <span className="truncate">{current.label}</span>
              </span>
            )}
          </div>
        </ListboxButton>

        <div className="relative w-full min-w-0">
          <Transition
            show={state}
            as={Fragment}
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions
              className="absolute left-0 right-0 z-[900] mt-2 max-h-[min(442px,70vh)] w-full min-w-0 overflow-y-auto overflow-x-hidden rounded-rounded bg-white text-small-regular uppercase text-black shadow-lg drop-shadow-md no-scrollbar sm:left-auto sm:right-0 sm:w-[280px]"
              static
            >
              {options?.map((o, index) => (
                <ListboxOption
                  key={`${o.country}-${index}`}
                  value={o}
                  className="flex cursor-pointer items-center gap-x-2 px-3 py-3 hover:bg-gray-200"
                >
                  <ReactCountryFlag
                    svg
                    style={{
                      width: "16px",
                      height: "16px",
                      flexShrink: 0,
                    }}
                    countryCode={o.country}
                  />

                  <span className="min-w-0 break-words">{o.label}</span>
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

export default CountrySelect
