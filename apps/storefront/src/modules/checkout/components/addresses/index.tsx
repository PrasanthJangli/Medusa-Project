
"use client"

import { setAddresses } from "@lib/data/cart"
import useToggleState from "@lib/hooks/use-toggle-state"
import compareAddresses from "@lib/util/compare-addresses"
import { CheckCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import Divider from "@modules/common/components/divider"
import { Heading, Text } from "@modules/common/components/ui"
import Spinner from "@modules/common/icons/spinner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState } from "react"

import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"

type AddressesProps = {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}

const Addresses = ({ cart, customer }: AddressesProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "address"

  const { state: sameAsBilling, toggle: toggleSameAsBilling } =
    useToggleState(
      cart?.shipping_address && cart?.billing_address
        ? compareAddresses(
            cart.shipping_address,
            cart.billing_address
          )
        : true
    )

  const handleEdit = () => {
    router.push(`${pathname}?step=address`)
  }

  const [message, formAction] = useActionState(setAddresses, null)

  return (
    <section
      className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/50 to-blue-50 shadow-lg shadow-indigo-100/40"
      data-testid="checkout-addresses"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-indigo-100 bg-gradient-to-r from-violet-100 via-blue-50 to-cyan-50 p-5 sm:p-7">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-md ${
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

          <div>
            <Heading
              level="h2"
              className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
            >
              Shipping Address
            </Heading>

            <p className="mt-1 text-sm text-slate-600">
              Where should we deliver your order?
            </p>
          </div>
        </div>

        {!isOpen && cart?.shipping_address && (
          <button
            type="button"
            onClick={handleEdit}
            className="rounded-full border border-indigo-200 bg-white px-5 py-2 text-sm font-bold text-indigo-700 shadow-sm transition hover:border-indigo-400 hover:bg-indigo-50"
            data-testid="edit-address-button"
          >
            Edit Address
          </button>
        )}
      </div>

      {/* Address form */}
      {isOpen ? (
        <form action={formAction} className="p-4 sm:p-7">
          <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 p-3 sm:p-5">
            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
            />
          </div>

          {!sameAsBilling && (
            <div className="mt-6 rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-4 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 text-white">
                  <span className="text-lg" aria-hidden="true">
                    🏠
                  </span>
                </div>

                <div>
                  <Heading
                    level="h2"
                    className="text-lg font-bold text-orange-950"
                  >
                    Billing Address
                  </Heading>

                  <p className="mt-1 text-sm text-orange-800">
                    Enter your billing details.
                  </p>
                </div>
              </div>

              <BillingAddress cart={cart} />
            </div>
          )}

          <div className="mt-6">
            <SubmitButton
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-200 transition duration-200 hover:from-violet-700 hover:via-indigo-700 hover:to-blue-700 sm:w-auto"
              data-testid="submit-address-button"
            >
              Continue to delivery →
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
        /* Saved address summary */
        <div className="grid grid-cols-1 gap-4 p-4 sm:p-7 md:grid-cols-2 xl:grid-cols-3">
          {/* Shipping address */}
          <div
            className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            data-testid="shipping-address-summary"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                <span className="text-lg" aria-hidden="true">
                  📍
                </span>
              </div>

              <h3 className="text-sm font-bold uppercase tracking-wide text-blue-950">
                Deliver To
              </h3>
            </div>

            <p className="font-bold text-slate-900">
              {cart.shipping_address.first_name}{" "}
              {cart.shipping_address.last_name}
            </p>

            <p className="mt-2 break-words text-sm leading-6 text-slate-600">
              {cart.shipping_address.address_1}
              {cart.shipping_address.address_2
                ? `, ${cart.shipping_address.address_2}`
                : ""}
              <br />
              {cart.shipping_address.postal_code},{" "}
              {cart.shipping_address.city}
              {cart.shipping_address.province
                ? `, ${cart.shipping_address.province}`
                : ""}
              <br />
              {cart.shipping_address.country_code?.toUpperCase()}
            </p>
          </div>

          {/* Contact details */}
          <div
            className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            data-testid="shipping-contact-summary"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white">
                <span className="text-lg" aria-hidden="true">
                  ✉️
                </span>
              </div>

              <h3 className="text-sm font-bold uppercase tracking-wide text-violet-950">
                Contact Details
              </h3>
            </div>

            <p className="break-words text-sm text-slate-700">
              {cart.shipping_address.phone || "No phone provided"}
            </p>

            <p className="mt-3 break-words text-sm text-slate-700">
              {cart.email}
            </p>
          </div>

          {/* Billing address */}
          <div
            className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            data-testid="billing-address-summary"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <span className="text-lg" aria-hidden="true">
                  ✓
                </span>
              </div>

              <h3 className="text-sm font-bold uppercase tracking-wide text-emerald-950">
                Billing Address
              </h3>
            </div>

            {sameAsBilling ? (
              <p className="text-sm leading-6 text-emerald-800">
                Billing and shipping addresses are the same.
              </p>
            ) : (
              <>
                <p className="font-bold text-slate-900">
                  {cart.billing_address?.first_name}{" "}
                  {cart.billing_address?.last_name}
                </p>

                <p className="mt-2 break-words text-sm leading-6 text-slate-600">
                  {cart.billing_address?.address_1}
                  {cart.billing_address?.address_2
                    ? `, ${cart.billing_address.address_2}`
                    : ""}
                  <br />
                  {cart.billing_address?.postal_code},{" "}
                  {cart.billing_address?.city}
                  {cart.billing_address?.province
                    ? `, ${cart.billing_address.province}`
                    : ""}
                  <br />
                  {cart.billing_address?.country_code?.toUpperCase()}
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-3 p-10 text-sm text-slate-500">
          <Spinner />
          Loading address details...
        </div>
      )}

      <div className="px-5 pb-5 sm:px-7 sm:pb-7">
        <Divider />
        <p className="mt-4 text-xs text-slate-500">
          Your address details are used to process your order.
        </p>
      </div>
    </section>
  )
}

export default Addresses
