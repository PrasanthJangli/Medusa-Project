
"use client"

import React from "react"
import { useLocale } from "next-intl"
import { ArrowRightOnRectangle } from "@medusajs/icons"
import { clx } from "@modules/common/components/ui"
import { useParams, usePathname } from "next/navigation"

import { signout } from "@lib/data/customer"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import MapPin from "@modules/common/icons/map-pin"
import Package from "@modules/common/icons/package"
import User from "@modules/common/icons/user"

const translations = {
  en: {
    account: "Account",
    hello: "Hello",
    overview: "Overview",
    profile: "Profile",
    addresses: "Addresses",
    orders: "Orders",
    logout: "Log out",
  },
  te: {
    account: "ఖాతా",
    hello: "నమస్కారం",
    overview: "అవలోకనం",
    profile: "ప్రొఫైల్",
    addresses: "చిరునామాలు",
    orders: "ఆర్డర్లు",
    logout: "లాగ్ అవుట్",
  },
  hi: {
    account: "खाता",
    hello: "नमस्ते",
    overview: "अवलोकन",
    profile: "प्रोफ़ाइल",
    addresses: "पते",
    orders: "ऑर्डर",
    logout: "लॉग आउट",
  },
}

const AccountNav = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) => {
  const route = usePathname()
  const locale = useLocale()
  const t =
    translations[locale as keyof typeof translations] ?? translations.en

  const { countryCode } = useParams() as { countryCode: string }

  const handleLogout = async () => {
    await signout(countryCode)
  }

  return (
    <div>
      <div className="small:hidden" data-testid="mobile-account-nav">
        {route !== `/${countryCode}/account` ? (
          <LocalizedClientLink
            href="/account"
            className="flex items-center gap-x-2 py-2 text-small-regular"
            data-testid="account-main-link"
          >
            <>
              <ChevronDown className="rotate-90 transform" />
              <span>{t.account}</span>
            </>
          </LocalizedClientLink>
        ) : (
          <>
            <div className="mb-4 px-8 text-xl-semi">
              {t.hello} {customer?.first_name}
            </div>

            <div className="text-base-regular">
              <ul>
                <li>
                  <LocalizedClientLink
                    href="/account/profile"
                    className="flex items-center justify-between border-b border-gray-200 px-8 py-4"
                    data-testid="profile-link"
                  >
                    <>
                      <div className="flex items-center gap-x-2">
                        <User size={20} />
                        <span>{t.profile}</span>
                      </div>
                      <ChevronDown className="-rotate-90 transform" />
                    </>
                  </LocalizedClientLink>
                </li>

                <li>
                  <LocalizedClientLink
                    href="/account/addresses"
                    className="flex items-center justify-between border-b border-gray-200 px-8 py-4"
                    data-testid="addresses-link"
                  >
                    <>
                      <div className="flex items-center gap-x-2">
                        <MapPin size={20} />
                        <span>{t.addresses}</span>
                      </div>
                      <ChevronDown className="-rotate-90 transform" />
                    </>
                  </LocalizedClientLink>
                </li>

                <li>
                  <LocalizedClientLink
                    href="/account/orders"
                    className="flex items-center justify-between border-b border-gray-200 px-8 py-4"
                    data-testid="orders-link"
                  >
                    <div className="flex items-center gap-x-2">
                      <Package size={20} />
                      <span>{t.orders}</span>
                    </div>
                    <ChevronDown className="-rotate-90 transform" />
                  </LocalizedClientLink>
                </li>

                <li>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between border-b border-gray-200 px-8 py-4"
                    onClick={handleLogout}
                    data-testid="logout-button"
                  >
                    <div className="flex items-center gap-x-2">
                      <ArrowRightOnRectangle />
                      <span>{t.logout}</span>
                    </div>
                    <ChevronDown className="-rotate-90 transform" />
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>

      <div className="hidden small:block" data-testid="account-nav">
        <div>
          <div className="pb-4">
            <h3 className="text-base-semi">{t.account}</h3>
          </div>

          <div className="text-base-regular">
            <ul className="mb-0 flex flex-col items-start justify-start gap-y-4">
              <li>
                <AccountNavLink
                  href="/account"
                  route={route!}
                  data-testid="overview-link"
                >
                  {t.overview}
                </AccountNavLink>
              </li>

              <li>
                <AccountNavLink
                  href="/account/profile"
                  route={route!}
                  data-testid="profile-link"
                >
                  {t.profile}
                </AccountNavLink>
              </li>

              <li>
                <AccountNavLink
                  href="/account/addresses"
                  route={route!}
                  data-testid="addresses-link"
                >
                  {t.addresses}
                </AccountNavLink>
              </li>

              <li>
                <AccountNavLink
                  href="/account/orders"
                  route={route!}
                  data-testid="orders-link"
                >
                  {t.orders}
                </AccountNavLink>
              </li>

              <li className="text-grey-700">
                <button
                  type="button"
                  onClick={handleLogout}
                  data-testid="logout-button"
                >
                  {t.logout}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

type AccountNavLinkProps = {
  href: string
  route: string
  children: React.ReactNode
  "data-testid"?: string
}

const AccountNavLink = ({
  href,
  route,
  children,
  "data-testid": dataTestId,
}: AccountNavLinkProps) => {
  const { countryCode }: { countryCode: string } = useParams()

  const active = route.split(countryCode)[1] === href

  return (
    <LocalizedClientLink
      href={href}
      className={clx("text-ui-fg-subtle hover:text-ui-fg-base", {
        "font-semibold text-ui-fg-base": active,
      })}
      data-testid={dataTestId}
    >
      {children}
    </LocalizedClientLink>
  )
}

export default AccountNav
