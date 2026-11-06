"use client"

import { Badge, Heading, Input, Label, Text } from "@modules/common/components/ui"
import React from "react"
import { useLocale } from "next-intl"

import { applyPromotions } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import Trash from "@modules/common/icons/trash"
import ErrorMessage from "../error-message"
import { SubmitButton } from "../submit-button"

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart
}

const translations = {
  en: {
    addPromotion: "Add Promotion Code(s)",
    apply: "Apply",
    applied: "Promotion(s) applied:",
    remove: "Remove discount code from order",
  },
  te: {
    addPromotion: "ప్రమోషన్ కోడ్ జోడించండి",
    apply: "వర్తింపజేయండి",
    applied: "వర్తింపజేసిన ప్రమోషన్లు:",
    remove: "ఆర్డర్ నుండి డిస్కౌంట్ కోడ్ తొలగించండి",
  },
  hi: {
    addPromotion: "प्रमोशन कोड जोड़ें",
    apply: "लागू करें",
    applied: "लागू किए गए प्रमोशन:",
    remove: "ऑर्डर से डिस्काउंट कोड हटाएं",
  },
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")
  const locale = useLocale()

  const t =
    translations[locale as keyof typeof translations] ?? translations.en

  const { promotions = [] } = cart

  const removePromotionCode = async (code: string) => {
    const validPromotions = promotions.filter(
      (promotion) => promotion.code !== code
    )

    await applyPromotions(
      validPromotions.filter((p) => p.code !== undefined).map((p) => p.code!)
    )
  }

  const addPromotionCode = async (formData: FormData) => {
    setErrorMessage("")

    const code = formData.get("code")
    if (!code) {
      return
    }

    const input = document.getElementById(
      "promotion-input"
    ) as HTMLInputElement

    const codes = promotions
      .filter((p) => p.code !== undefined)
      .map((p) => p.code!)

    codes.push(code.toString())

    try {
      await applyPromotions(codes)
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : String(e))
    }

    if (input) {
      input.value = ""
    }
  }

  return (
    <div className="flex w-full flex-col bg-white">
      <div className="txt-medium">
        <form action={(a) => addPromotionCode(a)} className="mb-5 w-full">
          <Label className="my-2 flex items-center gap-x-1">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="txt-medium text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="add-discount-button"
            >
              {t.addPromotion}
            </button>
          </Label>

          {isOpen && (
            <>
              <div className="flex w-full gap-x-2">
                <Input
                  className="size-full"
                  id="promotion-input"
                  name="code"
                  type="text"
                  autoFocus={false}
                  data-testid="discount-input"
                />

                <SubmitButton
                  variant="secondary"
                  data-testid="discount-apply-button"
                >
                  {t.apply}
                </SubmitButton>
              </div>

              <ErrorMessage
                error={errorMessage}
                data-testid="discount-error-message"
              />
            </>
          )}
        </form>

        {promotions.length > 0 && (
          <div className="flex w-full items-center">
            <div className="flex w-full flex-col">
              <Heading className="mb-2 txt-medium">
                {t.applied}
              </Heading>

              {promotions.map((promotion) => {
                return (
                  <div
                    key={promotion.id}
                    className="mb-2 flex w-full max-w-full items-center justify-between"
                    data-testid="discount-row"
                  >
                    <Text className="flex w-4/5 items-baseline gap-x-1 pr-1 txt-small-plus">
                      <span className="truncate" data-testid="discount-code">
                        <Badge
                          color={promotion.is_automatic ? "green" : "grey"}
                        >
                          {promotion.code}
                        </Badge>{" "}
                        (
                        {promotion.application_method?.value !== undefined &&
                          promotion.application_method.currency_code !==
                            undefined && (
                            <>
                              {promotion.application_method.type ===
                              "percentage"
                                ? `${promotion.application_method.value}%`
                                : convertToLocale({
                                    amount: +promotion.application_method.value,
                                    currency_code:
                                      promotion.application_method
                                        .currency_code,
                                  })}
                            </>
                          )}
                        )
                      </span>
                    </Text>

                    {!promotion.is_automatic && (
                      <button
                        className="flex items-center"
                        onClick={() => {
                          if (!promotion.code) {
                            return
                          }

                          removePromotionCode(promotion.code)
                        }}
                        data-testid="remove-discount-button"
                      >
                        <Trash size={14} />
                        <span className="sr-only">{t.remove}</span>
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscountCode