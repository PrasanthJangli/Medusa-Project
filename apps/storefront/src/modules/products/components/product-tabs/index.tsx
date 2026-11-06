"use client"

import { useEffect, useState } from "react"
import { useLocale } from "next-intl"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"
import { HttpTypes } from "@medusajs/types"

import Accordion from "./accordion"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const translations = {
  en: {
    productInformation: "Product Information",
    shippingReturns: "Shipping & Returns",
    material: "Material",
    origin: "Country of origin",
    type: "Type",
    weight: "Weight",
    dimensions: "Dimensions",
    fastDelivery: "Fast delivery",
    deliveryDescription: "Your package will arrive in 3-5 business days at your pick up location or in the comfort of your home.",
    exchanges: "Simple exchanges",
    exchangeDescription: "Is the fit not quite right? No worries - we'll exchange your product for a new one.",
    returns: "Easy returns",
    returnDescription: "Just return your product and we'll refund your money. No questions asked – we'll do our best to make sure your return is hassle-free.",
  },
  te: {
    productInformation: "ఉత్పత్తి సమాచారం",
    shippingReturns: "డెలివరీ మరియు రిటర్న్స్",
    material: "మెటీరియల్",
    origin: "తయారీ దేశం",
    type: "రకం",
    weight: "బరువు",
    dimensions: "కొలతలు",
    fastDelivery: "వేగవంతమైన డెలివరీ",
    deliveryDescription: "మీ పార్సిల్ 3-5 పని దినాల్లో మీరు ఎంచుకున్న పికప్ ప్రదేశానికి లేదా మీ ఇంటికి చేరుకుంటుంది.",
    exchanges: "సులభమైన మార్పిడి",
    exchangeDescription: "మీకు సరైన సైజు కుదరలేదా? సమస్య లేదు - మీ ఉత్పత్తిని కొత్త దానితో మార్చిస్తాము.",
    returns: "సులభమైన రిటర్న్స్",
    returnDescription: "మీ ఉత్పత్తిని తిరిగి పంపండి, మీ డబ్బును తిరిగి చెల్లిస్తాము. మీ రిటర్న్ ప్రక్రియను సులభంగా చేయడానికి మేము ప్రయత్నిస్తాము.",
  },
  hi: {
    productInformation: "उत्पाद जानकारी",
    shippingReturns: "डिलीवरी और वापसी",
    material: "सामग्री",
    origin: "मूल देश",
    type: "प्रकार",
    weight: "वज़न",
    dimensions: "आयाम",
    fastDelivery: "तेज़ डिलीवरी",
    deliveryDescription: "आपका पैकेज 3-5 कार्यदिवसों में आपके चुने हुए पिकअप स्थान या आपके घर पहुँच जाएगा।",
    exchanges: "आसान एक्सचेंज",
    exchangeDescription: "क्या सही साइज़ नहीं मिला? चिंता न करें - हम आपके उत्पाद को नए उत्पाद से बदल देंगे।",
    returns: "आसान वापसी",
    returnDescription: "अपना उत्पाद वापस करें और हम आपके पैसे वापस कर देंगे। हम वापसी की प्रक्रिया को आसान बनाने की पूरी कोशिश करेंगे।",
  },
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const [mounted, setMounted] = useState(false)
  const locale = useLocale()
  const t = translations[locale as keyof typeof translations] || translations.en

  useEffect(() => {
    setMounted(true)
  }, [])

  const tabs = [
    {
      id: "product-information",
      label: t.productInformation,
      component: <ProductInfoTab product={product} t={t} />,
    },
    {
      id: "shipping-returns",
      label: t.shippingReturns,
      component: <ShippingInfoTab t={t} />,
    },
  ]

  if (!mounted) {
    return <div className="w-full" />
  }

  return (
    <div className="w-full">
      <Accordion type="multiple" defaultValue={[]}>
        {tabs.map((tab) => (
          <Accordion.Item
            key={tab.id}
            title={tab.label}
            headingSize="medium"
            value={tab.id}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

type TranslationData = (typeof translations)["en"]

const ProductInfoTab = ({
  product,
  t,
}: ProductTabsProps & { t: TranslationData }) => {
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-2 gap-x-8">
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">{t.material}</span>
            <p>{product.material || "-"}</p>
          </div>

          <div>
            <span className="font-semibold">{t.origin}</span>
            <p>{product.origin_country || "-"}</p>
          </div>

          <div>
            <span className="font-semibold">{t.type}</span>
            <p>{product.type?.value || "-"}</p>
          </div>
        </div>

        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">{t.weight}</span>
            <p>{product.weight ? `${product.weight} g` : "-"}</p>
          </div>

          <div>
            <span className="font-semibold">{t.dimensions}</span>
            <p>
              {product.length && product.width && product.height
                ? `${product.length}L x ${product.width}W x ${product.height}H`
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ShippingInfoTab = ({ t }: { t: TranslationData }) => {
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold">{t.fastDelivery}</span>
            <p className="max-w-sm">{t.deliveryDescription}</p>
          </div>
        </div>

        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-semibold">{t.exchanges}</span>
            <p className="max-w-sm">{t.exchangeDescription}</p>
          </div>
        </div>

        <div className="flex items-start gap-x-2">
          <Back />
          <div>
            <span className="font-semibold">{t.returns}</span>
            <p className="max-w-sm">{t.returnDescription}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs