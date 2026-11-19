"use client"

import { Listbox, Transition } from "@headlessui/react"
import { ChevronUpDown } from "@medusajs/icons"
import { clx } from "@modules/common/components/ui"
import { Fragment, useMemo } from "react"
import { useLocale } from "next-intl"

import compareAddresses from "@lib/util/compare-addresses"
import { HttpTypes } from "@medusajs/types"
import Radio from "@modules/common/components/radio"

type AddressSelectProps = {
  addresses: HttpTypes.StoreCustomerAddress[]
  addressInput: HttpTypes.StoreCartAddress | null
  onSelect: (
    address: HttpTypes.StoreCartAddress | undefined,
    email?: string
  ) => void
}

const translations = {
  en: {
    chooseAddress: "Choose an address",
  },
  te: {
    chooseAddress: "చిరునామాను ఎంచుకోండి",
  },
  hi: {
    chooseAddress: "पता चुनें",
  },
}

const AddressSelect = ({
  addresses,
  addressInput,
  onSelect,
}: AddressSelectProps) => {
  const locale = useLocale() as "en" | "te" | "hi"
  const t = translations[locale] || translations.en

  const handleSelect = (id: string) => {
    const savedAddress = addresses.find((a) => a.id === id)

    if (savedAddress) {
      onSelect(savedAddress as HttpTypes.StoreCartAddress)
    }
  }

  const selectedAddress = useMemo(() => {
    return addresses.find(
      (a) => addressInput && compareAddresses(a, addressInput)
    )
  }, [addresses, addressInput])

  return (
    <Listbox onChange={handleSelect} value={selectedAddress?.id}>
      <div className="relative w-full min-w-0">
        <Listbox.Button
          className="relative flex min-h-[48px] w-full min-w-0 items-center justify-between gap-3 rounded-rounded border bg-white px-3 py-3 text-left text-sm outline-none transition-colors hover:border-gray-400 focus:border-gray-400 focus-visible:ring-2 focus-visible:ring-gray-300 sm:px-4 sm:text-base"
          data-testid="shipping-address-select"
        >
          {({ open }) => (
            <>
              <span className="min-w-0 flex-1 truncate">
                {selectedAddress
                  ? selectedAddress.address_1
                  : t.chooseAddress}
              </span>

              <ChevronUpDown
                className={clx(
                  "h-5 w-5 shrink-0 transition-transform duration-200",
                  {
                    "rotate-180": open,
                  }
                )}
              />
            </>
          )}
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className="absolute left-0 top-full z-30 mt-1 max-h-60 w-full overflow-y-auto overflow-x-hidden rounded-lg border bg-white py-1 text-sm shadow-lg focus:outline-none sm:text-base"
            data-testid="shipping-address-options"
          >
            {addresses.map((address) => (
              <Listbox.Option
                key={address.id}
                value={address.id}
                className={({ active }) =>
                  clx(
                    "relative cursor-pointer select-none px-3 py-3 sm:px-4 sm:py-4",
                    {
                      "bg-gray-50": active,
                    }
                  )
                }
                data-testid="shipping-address-option"
              >
                <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                  <div className="shrink-0 pt-1">
                    <Radio
                      checked={selectedAddress?.id === address.id}
                      data-testid="shipping-address-radio"
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="break-words text-left text-sm font-semibold sm:text-base">
                      {address.first_name} {address.last_name}
                    </span>

                    {address.company && (
                      <span className="mt-1 break-words text-xs text-ui-fg-base sm:text-sm">
                        {address.company}
                      </span>
                    )}

                    <div className="mt-2 flex min-w-0 flex-col break-words text-left text-xs leading-5 text-gray-600 sm:text-sm sm:leading-6">
                      <span>
                        {address.address_1}
                        {address.address_2 && `, ${address.address_2}`}
                      </span>

                      <span>
                        {address.postal_code}, {address.city}
                      </span>

                      <span>
                        {address.province && `${address.province}, `}
                        {address.country_code?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}

export default AddressSelect
