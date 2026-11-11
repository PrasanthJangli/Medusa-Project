
"use client"

import { setAddresses } from "@lib/data/cart"
import useToggleState from "@lib/hooks/use-toggle-state"
import compareAddresses from "@lib/util/compare-addresses"
import { CheckCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import Divider from "@modules/common/components/divider"
import { Heading } from "@modules/common/components/ui"
import Spinner from "@modules/common/icons/spinner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState } from "react"
import { useLocale } from "next-intl"

import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"

type AddressesProps = {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}

const translations: Record<string, Record<string, string>> = {
  en: {
    shippingAddress: "Shipping Address",
    shippingDescription: "Where should we deliver your order?",
    editAddress: "Edit Address",
    billingAddress: "Billing Address",
    billingDescription: "Enter your billing details.",
    continueDelivery: "Continue to delivery →",
    deliverTo: "Deliver To",
    contactDetails: "Contact Details",
    noPhone: "No phone provided",
    sameAddress: "Billing and shipping addresses are the same.",
    loading: "Loading address details...",
    addressNote: "Your address details are used to process your order.",
  },

  te: {
    shippingAddress: "డెలివరీ చిరునామా",
    shippingDescription: "మీ ఆర్డర్‌ను ఎక్కడికి డెలివరీ చేయాలి?",
    editAddress: "చిరునామాను మార్చండి",
    billingAddress: "బిల్లింగ్ చిరునామా",
    billingDescription: "మీ బిల్లింగ్ వివరాలను నమోదు చేయండి.",
    continueDelivery: "డెలివరీకి కొనసాగండి →",
    deliverTo: "డెలివరీ చిరునామా",
    contactDetails: "సంప్రదింపు వివరాలు",
    noPhone: "ఫోన్ నంబర్ అందించలేదు",
    sameAddress: "బిల్లింగ్ మరియు డెలివరీ చిరునామాలు ఒకటే.",
    loading: "చిరునామా వివరాలు లోడ్ అవుతున్నాయి...",
    addressNote:
      "మీ ఆర్డర్‌ను ప్రాసెస్ చేయడానికి మీ చిరునామా వివరాలు ఉపయోగించబడతాయి.",
  },

  hi: {
    shippingAddress: "डिलीवरी का पता",
    shippingDescription: "आपका ऑर्डर कहाँ डिलीवर करना है?",
    editAddress: "पता बदलें",
    billingAddress: "बिलिंग पता",
    billingDescription: "अपनी बिलिंग जानकारी दर्ज करें।",
    continueDelivery: "डिलीवरी के लिए आगे बढ़ें →",
    deliverTo: "डिलीवरी का पता",
    contactDetails: "संपर्क विवरण",
    noPhone: "फ़ोन नंबर उपलब्ध नहीं है",
    sameAddress: "बिलिंग और डिलीवरी का पता एक ही है।",
    loading: "पते की जानकारी लोड हो रही है...",
    addressNote:
      "आपके ऑर्डर को प्रोसेस करने के लिए आपके पते की जानकारी का उपयोग किया जाता है।",
  },
}

// Offline address and name transliteration mapping
const addressTranslations: Record<string, Record<string, string>> = {
  te: {
    "prasanthkumar": "ప్రశాంత్ కుమార్",
    "prasanth kumar": "ప్రశాంత్ కుమార్",
    "prasanth": "ప్రశాంత్",
    "kumar": "కుమార్",
    "jangli": "జంగ్లీ",
    "prasanth kumar jangli": "ప్రశాంత్ కుమార్ జంగ్లీ",
    "kumar jangli": "కుమార్ జంగ్లీ",
    "kavyasree": "కావ్యశ్రీ",
    "pothukunta dharmavaram": "పోతుకుంట ధర్మవరం",
    "pothukunta": "పోతుకుంట",
    "dharmavaram": "ధర్మవరం",
    "ananthapur": "అనంతపురం",
    "anantapur": "అనంతపురం",
    "andhra pradesh": "ఆంధ్రప్రదేశ్",
  },

  hi: {
    "prasanthkumar": "प्रशांत कुमार",
    "prasanth kumar": "प्रशांत कुमार",
    "prasanth": "प्रशांत",
    "kumar": "कुमार",
    "jangli": "जंगली",
    "prasanth kumar jangli": "प्रशांत कुमार जंगली",
    "kumar jangli": "कुमार जंगली",
    "kavyasree": "काव्यश्री",
    "pothukunta dharmavaram": "पोथुकुंटा धर्मवरम",
    "pothukunta": "पोथुकुंटा",
    "dharmavaram": "धर्मवरम",
    "ananthapur": "अनंतपुर",
    "anantapur": "अनंतपुर",
    "andhra pradesh": "आंध्र प्रदेश",
  },
}

const translateAddressValue = (
  value: string | null | undefined,
  locale: string
): string => {
  if (!value) return ""

  const normalizedLocale = locale.split("-")[0].toLowerCase()

  if (normalizedLocale === "en") {
    return value
  }

  const normalizedValue = value.trim().toLowerCase()

  return (
    addressTranslations[normalizedLocale]?.[normalizedValue] ?? value
  )
}

// Country code translation
const translateCountryCode = (
  countryCode: string | null | undefined,
  locale: string
): string => {
  if (!countryCode) return ""

  const code = countryCode.toUpperCase()
  const normalizedLocale = locale.split("-")[0].toLowerCase()

  const countries: Record<string, Record<string, string>> = {
    IN: {
      en: "India",
      te: "భారతదేశం",
      hi: "भारत",
    },
  }

  return countries[code]?.[normalizedLocale] ?? code
}

const Addresses = ({ cart, customer }: AddressesProps) => {
  const currentLocale = useLocale()
  const locale = currentLocale.split("-")[0].toLowerCase()

  const t = (key: string) =>
    translations[locale]?.[key] ?? translations.en[key] ?? key

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "address"

  const { state: sameAsBilling, toggle: toggleSameAsBilling } =
    useToggleState(
      cart?.shipping_address && cart?.billing_address
        ? compareAddresses(cart.shipping_address, cart.billing_address)
        : true
    )

  const handleEdit = () => {
    router.push(`${pathname}?step=address`)
  }

  const [message, formAction] = useActionState(setAddresses, null)

  return (
    <section
      className="w-full min-w-0 overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/50 to-blue-50 shadow-lg shadow-indigo-100/40"
      data-testid="checkout-addresses"
    >
      <div className="flex flex-col gap-4 border-b border-indigo-100 bg-gradient-to-r from-violet-100 via-blue-50 to-cyan-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:p-6 lg:p-7">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-md sm:h-12 sm:w-12 ${
              !isOpen && cart?.shipping_address
                ? "bg-gradient-to-br from-emerald-400 to-green-600 text-white"
                : "bg-gradient-to-br from-violet-600 to-indigo-600 text-white"
            }`}
          >
            {!isOpen && cart?.shipping_address ? (
              <CheckCircleSolid />
            ) : (
              <span className="text-lg font-bold">1</span>
            )}
          </div>

          <div className="min-w-0">
            <Heading
              level="h2"
              className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl lg:text-2xl"
            >
              {t("shippingAddress")}
            </Heading>

            <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm">
              {t("shippingDescription")}
            </p>
          </div>
        </div>

        {!isOpen && cart?.shipping_address && (
          <button
            type="button"
            onClick={handleEdit}
            className="min-h-10 w-full rounded-full border border-indigo-200 bg-white px-5 py-2 text-sm font-bold text-indigo-700 shadow-sm transition hover:border-indigo-400 hover:bg-indigo-50 sm:w-auto"
            data-testid="edit-address-button"
          >
            {t("editAddress")}
          </button>
        )}
      </div>

      {isOpen ? (
        <form action={formAction} className="p-3 sm:p-5 lg:p-7">
          <div className="min-w-0 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 p-3 sm:p-5">
            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
            />
          </div>

          {!sameAsBilling && (
            <div className="mt-4 min-w-0 rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-3 sm:mt-6 sm:p-5 lg:p-6">
              <div className="mb-4 flex items-center gap-3 sm:mb-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 text-white sm:h-10 sm:w-10">
                  <span className="text-lg" aria-hidden="true">
                    🏠
                  </span>
                </div>

                <div className="min-w-0">
                  <Heading
                    level="h2"
                    className="text-base font-bold text-orange-950 sm:text-lg"
                  >
                    {t("billingAddress")}
                  </Heading>

                  <p className="mt-1 text-xs text-orange-800 sm:text-sm">
                    {t("billingDescription")}
                  </p>
                </div>
              </div>

              <BillingAddress cart={cart} />
            </div>
          )}

          <div className="mt-5 sm:mt-6">
            <SubmitButton
              className="min-h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition duration-200 hover:from-violet-700 hover:via-indigo-700 hover:to-blue-700 sm:w-auto sm:px-7"
              data-testid="submit-address-button"
            >
              {t("continueDelivery")}
            </SubmitButton>

            <div className="mt-3">
              <ErrorMessage
                error={message}
                data-testid="address-error-message"
              />
            </div>
          </div>
        </form>
      ) : cart?.shipping_address ? (
        <div className="grid min-w-0 grid-cols-1 gap-3 p-3 sm:gap-4 sm:p-5 md:grid-cols-2 lg:p-7 xl:grid-cols-3">
          {/* Shipping Address */}
          <div
            className="min-w-0 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 shadow-sm transition hover:shadow-md sm:p-5"
            data-testid="shipping-address-summary"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white sm:h-10 sm:w-10">
                <span className="text-lg" aria-hidden="true">
                  📍
                </span>
              </div>

              <h3 className="text-xs font-bold uppercase tracking-wide text-blue-950 sm:text-sm">
                {t("deliverTo")}
              </h3>
            </div>

            <p className="break-words font-bold text-slate-900">
              {translateAddressValue(
                `${cart.shipping_address.first_name || ""} ${cart.shipping_address.last_name || ""}`.trim(),
                locale
              )}
            </p>

            <p className="mt-2 break-words text-xs leading-6 text-slate-600 sm:text-sm">
              {translateAddressValue(
                cart.shipping_address.address_1,
                locale
              )}
              {cart.shipping_address.address_2
                ? `, ${translateAddressValue(
                    cart.shipping_address.address_2,
                    locale
                  )}`
                : ""}
              <br />
              {cart.shipping_address.postal_code},{" "}
              {translateAddressValue(
                cart.shipping_address.city,
                locale
              )}
              {cart.shipping_address.province
                ? `, ${translateAddressValue(
                    cart.shipping_address.province,
                    locale
                  )}`
                : ""}
              <br />
              {translateCountryCode(
                cart.shipping_address.country_code,
                locale
              )}
            </p>
          </div>

          {/* Contact Details */}
          <div
            className="min-w-0 rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 p-4 shadow-sm transition hover:shadow-md sm:p-5"
            data-testid="shipping-contact-summary"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white sm:h-10 sm:w-10">
                <span className="text-lg" aria-hidden="true">
                  ✉️
                </span>
              </div>

              <h3 className="text-xs font-bold uppercase tracking-wide text-violet-950 sm:text-sm">
                {t("contactDetails")}
              </h3>
            </div>

            <p className="break-all text-xs text-slate-700 sm:text-sm">
              {cart.shipping_address.phone || t("noPhone")}
            </p>

            <p className="mt-3 break-all text-xs text-slate-700 sm:text-sm">
              {cart.email}
            </p>
          </div>

          {/* Billing Address */}
          <div
            className="min-w-0 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 shadow-sm transition hover:shadow-md sm:p-5"
            data-testid="billing-address-summary"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white sm:h-10 sm:w-10">
                <span className="text-lg" aria-hidden="true">
                  ✓
                </span>
              </div>

              <h3 className="text-xs font-bold uppercase tracking-wide text-emerald-950 sm:text-sm">
                {t("billingAddress")}
              </h3>
            </div>

            {sameAsBilling ? (
              <p className="text-xs leading-6 text-emerald-800 sm:text-sm">
                {t("sameAddress")}
              </p>
            ) : (
              <>
                <p className="break-words font-bold text-slate-900">
                  {translateAddressValue(
                    `${cart.billing_address?.first_name || ""} ${cart.billing_address?.last_name || ""}`.trim(),
                    locale
                  )}
                </p>

                <p className="mt-2 break-words text-xs leading-6 text-slate-600 sm:text-sm">
                  {translateAddressValue(
                    cart.billing_address?.address_1,
                    locale
                  )}
                  {cart.billing_address?.address_2
                    ? `, ${translateAddressValue(
                        cart.billing_address.address_2,
                        locale
                      )}`
                    : ""}
                  <br />
                  {cart.billing_address?.postal_code},{" "}
                  {translateAddressValue(
                    cart.billing_address?.city,
                    locale
                  )}
                  {cart.billing_address?.province
                    ? `, ${translateAddressValue(
                        cart.billing_address.province,
                        locale
                      )}`
                    : ""}
                  <br />
                  {translateCountryCode(
                    cart.billing_address?.country_code,
                    locale
                  )}
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-3 p-8 text-center text-sm text-slate-500 sm:p-10">
          <Spinner />
          {t("loading")}
        </div>
      )}

      <div className="px-4 pb-4 sm:px-6 sm:pb-6 lg:px-7 lg:pb-7">
        <Divider />
        <p className="mt-4 text-xs leading-5 text-slate-500">
          {t("addressNote")}
        </p>
      </div>
    </section>
  )
}

export default Addresses
