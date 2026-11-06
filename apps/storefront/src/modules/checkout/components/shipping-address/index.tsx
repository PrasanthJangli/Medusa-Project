"use client"

import { HttpTypes } from "@medusajs/types"
import { Container } from "@modules/common/components/ui"
import Checkbox from "@modules/common/components/checkbox"
import Input from "@modules/common/components/input"
import { mapKeys } from "lodash"
import { useLocale } from "next-intl"
import React, { useEffect, useMemo, useState } from "react"
import AddressSelect from "../address-select"
import CountrySelect from "../country-select"

const translations = {
  en: {
    savedAddress: "Hi {name}, do you want to use one of your saved addresses?",
    firstName: "First name",
    lastName: "Last name",
    address: "Address",
    company: "Company",
    postalCode: "Postal code",
    city: "City",
    state: "State / Province",
    sameBilling: "Billing address same as shipping address",
    email: "Email",
    phone: "Phone",
    validEmail: "Enter a valid email address.",
  },
  te: {
    savedAddress: "హాయ్ {name}, మీరు సేవ్ చేసిన చిరునామాల్లో ఒకదాన్ని ఉపయోగించాలనుకుంటున్నారా?",
    firstName: "మొదటి పేరు",
    lastName: "చివరి పేరు",
    address: "చిరునామా",
    company: "కంపెనీ",
    postalCode: "పోస్టల్ కోడ్",
    city: "నగరం",
    state: "రాష్ట్రం / ప్రావిన్స్",
    sameBilling: "బిల్లింగ్ చిరునామా మరియు షిప్పింగ్ చిరునామా ఒకటే",
    email: "ఈమెయిల్",
    phone: "ఫోన్ నంబర్",
    validEmail: "సరైన ఈమెయిల్ చిరునామాను నమోదు చేయండి.",
  },
  hi: {
    savedAddress: "नमस्ते {name}, क्या आप अपने सहेजे गए पतों में से किसी एक का उपयोग करना चाहते हैं?",
    firstName: "पहला नाम",
    lastName: "अंतिम नाम",
    address: "पता",
    company: "कंपनी",
    postalCode: "पोस्टल कोड",
    city: "शहर",
    state: "राज्य / प्रांत",
    sameBilling: "बिलिंग पता और शिपिंग पता एक ही हैं",
    email: "ईमेल",
    phone: "फ़ोन नंबर",
    validEmail: "कृपया सही ईमेल पता दर्ज करें।",
  },
}

const ShippingAddress = ({
  customer,
  cart,
  checked,
  onChange,
}: {
  customer: HttpTypes.StoreCustomer | null
  cart: HttpTypes.StoreCart | null
  checked: boolean
  onChange: () => void
}) => {
  const locale = useLocale() as "en" | "te" | "hi"
  const t = translations[locale] || translations.en

  const [formData, setFormData] = useState<Record<string, string>>({
    "shipping_address.first_name":
      cart?.shipping_address?.first_name || "",
    "shipping_address.last_name":
      cart?.shipping_address?.last_name || "",
    "shipping_address.address_1":
      cart?.shipping_address?.address_1 || "",
    "shipping_address.company":
      cart?.shipping_address?.company || "",
    "shipping_address.postal_code":
      cart?.shipping_address?.postal_code || "",
    "shipping_address.city":
      cart?.shipping_address?.city || "",
    "shipping_address.country_code":
      cart?.shipping_address?.country_code || "",
    "shipping_address.province":
      cart?.shipping_address?.province || "",
    "shipping_address.phone":
      cart?.shipping_address?.phone || "",
    email: cart?.email || "",
  })

  const countriesInRegion = useMemo(
    () => cart?.region?.countries?.map((country) => country.iso_2),
    [cart?.region]
  )

  const addressesInRegion = useMemo(
    () =>
      customer?.addresses.filter(
        (address) =>
          address.country_code &&
          countriesInRegion?.includes(address.country_code)
      ),
    [customer?.addresses, countriesInRegion]
  )

  const setFormAddress = (
    address?: HttpTypes.StoreCartAddress,
    email?: string
  ) => {
    if (address) {
      setFormData((previous) => ({
        ...previous,
        "shipping_address.first_name": address.first_name || "",
        "shipping_address.last_name": address.last_name || "",
        "shipping_address.address_1": address.address_1 || "",
        "shipping_address.company": address.company || "",
        "shipping_address.postal_code": address.postal_code || "",
        "shipping_address.city": address.city || "",
        "shipping_address.country_code": address.country_code || "",
        "shipping_address.province": address.province || "",
        "shipping_address.phone": address.phone || "",
      }))
    }

    if (email) {
      setFormData((previous) => ({
        ...previous,
        email,
      }))
    }
  }

  useEffect(() => {
    if (cart?.shipping_address) {
      setFormAddress(cart.shipping_address, cart.email || undefined)
    }

    if (!cart?.email && customer?.email) {
      setFormAddress(undefined, customer.email)
    }
  }, [cart, customer?.email])

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  return (
    <>
      {customer && (addressesInRegion?.length || 0) > 0 && (
        <Container className="mb-6 flex flex-col gap-y-4 p-5">
          <p className="text-small-regular">
            {t.savedAddress.replace(
              "{name}",
              customer.first_name || ""
            )}
          </p>

          <AddressSelect
            addresses={customer.addresses}
            addressInput={
              mapKeys(formData, (_, key) =>
                key.replace("shipping_address.", "")
              ) as unknown as HttpTypes.StoreCartAddress
            }
            onSelect={setFormAddress}
          />
        </Container>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input
          label={t.firstName}
          name="shipping_address.first_name"
          autoComplete="given-name"
          value={formData["shipping_address.first_name"]}
          onChange={handleChange}
          required
          data-testid="shipping-first-name-input"
        />

        <Input
          label={t.lastName}
          name="shipping_address.last_name"
          autoComplete="family-name"
          value={formData["shipping_address.last_name"]}
          onChange={handleChange}
          required
          data-testid="shipping-last-name-input"
        />

        <Input
          label={t.address}
          name="shipping_address.address_1"
          autoComplete="address-line1"
          value={formData["shipping_address.address_1"]}
          onChange={handleChange}
          required
          data-testid="shipping-address-input"
        />

        <Input
          label={t.company}
          name="shipping_address.company"
          value={formData["shipping_address.company"]}
          onChange={handleChange}
          autoComplete="organization"
          data-testid="shipping-company-input"
        />

        <Input
          label={t.postalCode}
          name="shipping_address.postal_code"
          autoComplete="postal-code"
          value={formData["shipping_address.postal_code"]}
          onChange={handleChange}
          required
          data-testid="shipping-postal-code-input"
        />

        <Input
          label={t.city}
          name="shipping_address.city"
          autoComplete="address-level2"
          value={formData["shipping_address.city"]}
          onChange={handleChange}
          required
          data-testid="shipping-city-input"
        />

        <CountrySelect
          name="shipping_address.country_code"
          autoComplete="country"
          region={cart?.region}
          value={formData["shipping_address.country_code"]}
          onChange={handleChange}
          required
          data-testid="shipping-country-select"
        />

        <Input
          label={t.state}
          name="shipping_address.province"
          autoComplete="address-level1"
          value={formData["shipping_address.province"]}
          onChange={handleChange}
          data-testid="shipping-province-input"
        />
      </div>

      <div className="my-8">
        <Checkbox
          label={t.sameBilling}
          name="same_as_billing"
          checked={checked}
          onChange={onChange}
          data-testid="billing-address-checkbox"
        />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <Input
          label={t.email}
          name="email"
          type="email"
          title={t.validEmail}
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          required
          data-testid="shipping-email-input"
        />

        <Input
          label={t.phone}
          name="shipping_address.phone"
          type="tel"
          autoComplete="tel"
          value={formData["shipping_address.phone"]}
          onChange={handleChange}
          required
          data-testid="shipping-phone-input"
        />
      </div>
    </>
  )
}

export default ShippingAddress
