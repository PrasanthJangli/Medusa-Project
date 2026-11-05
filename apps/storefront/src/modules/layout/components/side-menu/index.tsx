
"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import useToggleState from "@lib/hooks/use-toggle-state"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text, clx } from "@modules/common/components/ui"
import { Fragment } from "react"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { Locale } from "@lib/data/locales"

const SideMenuItems = {
  Home: "/",
  Store: "/store",
  Account: "/account",
  Cart: "/cart",
}

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

const SideMenu = ({ regions, locales, currentLocale }: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()

  return (
    <div className="h-full">
      <div className="flex h-full items-center">
        <Popover className="flex h-full">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="flex h-full min-h-10 items-center px-2 text-sm font-medium transition-colors duration-200 hover:text-ui-fg-base focus:outline-none focus-visible:ring-2 focus-visible:ring-ui-fg-base focus-visible:ring-offset-2"
                >
                  Menu
                </Popover.Button>
              </div>

              {open && (
                <div
                  className="fixed inset-0 z-[50] bg-black/40"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                />
              )}

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 -translate-x-4"
                enterTo="opacity-100 translate-x-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 -translate-x-4"
              >
                <PopoverPanel className="fixed inset-y-0 left-0 z-[51] flex h-[100dvh] w-[88vw] max-w-[380px] flex-col overflow-y-auto bg-white text-sm text-neutral-900 shadow-2xl sm:w-[360px] lg:w-[400px]">
                  <div
                    data-testid="nav-menu-popup"
                    className="flex min-h-full flex-col justify-between p-5 sm:p-7"
                  >
                    {/* Header */}
                    <div>
                      <div className="mb-8 flex items-center justify-between border-b border-neutral-200 pb-5">
                        <span className="text-lg font-bold tracking-tight text-neutral-950">
                          Menu
                        </span>

                        <button
                          type="button"
                          data-testid="close-menu-button"
                          onClick={close}
                          aria-label="Close menu"
                          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                        >
                          <XMark className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Navigation links */}
                      <nav aria-label="Main navigation">
                        <ul className="flex flex-col items-stretch gap-2">
                          {Object.entries(SideMenuItems).map(
                            ([name, href]) => (
                              <li key={name}>
                                <LocalizedClientLink
                                  href={href}
                                  className="flex min-h-14 items-center justify-between rounded-xl px-3 py-3 text-2xl font-semibold leading-tight transition-colors hover:bg-neutral-100 hover:text-neutral-600 sm:text-3xl"
                                  onClick={close}
                                  data-testid={`${name.toLowerCase()}-link`}
                                >
                                  {name}
                                  <span className="text-lg text-neutral-400">
                                    →
                                  </span>
                                </LocalizedClientLink>
                              </li>
                            )
                          )}
                        </ul>
                      </nav>
                    </div>

                    {/* Locale and country settings */}
                    <div className="mt-10 flex flex-col gap-y-5">
                      {!!locales?.length && (
                        <div
                          className="flex min-w-0 items-center justify-between gap-3 border-t border-neutral-200 pt-5"
                          onMouseEnter={languageToggleState.open}
                          onMouseLeave={languageToggleState.close}
                        >
                          <div className="min-w-0 flex-1">
                            <LanguageSelect
                              toggleState={languageToggleState}
                              locales={locales}
                              currentLocale={currentLocale}
                            />
                          </div>

                          <ArrowRightMini
                            className={clx(
                              "h-5 w-5 shrink-0 transition-transform duration-150",
                              languageToggleState.state ? "-rotate-90" : ""
                            )}
                          />
                        </div>
                      )}

                      <div
                        className="flex min-w-0 items-center justify-between gap-3 border-t border-neutral-200 pt-5"
                        onMouseEnter={countryToggleState.open}
                        onMouseLeave={countryToggleState.close}
                      >
                        <div className="min-w-0 flex-1">
                          {regions && (
                            <CountrySelect
                              toggleState={countryToggleState}
                              regions={regions}
                            />
                          )}
                        </div>

                        <ArrowRightMini
                          className={clx(
                            "h-5 w-5 shrink-0 transition-transform duration-150",
                            countryToggleState.state ? "-rotate-90" : ""
                          )}
                        />
                      </div>

                      <Text className="flex flex-wrap justify-between border-t border-neutral-200 pt-5 text-xs leading-5 text-neutral-500">
                        © {new Date().getFullYear()} Medusa Store. All rights
                        reserved.
                      </Text>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
