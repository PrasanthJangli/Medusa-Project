
import {
  AbstractPaymentProvider,
  PaymentSessionStatus,
  PaymentActions,
} from "@medusajs/framework/utils"

import { Cashfree, CFEnvironment } from "cashfree-pg"
import { randomUUID } from "node:crypto"

type CashfreeOptions = {
  appId: string
  secretKey: string
  environment?: "sandbox" | "production"
  returnUrl?: string
}

type Address = {
  phone?: string | null
  first_name?: string | null
  last_name?: string | null
}

type Customer = {
  id?: string
  email?: string | null
  phone?: string | null
}

class CashfreePaymentProvider extends AbstractPaymentProvider<CashfreeOptions> {
  static identifier = "cashfree"

  protected options_: CashfreeOptions
  protected client: Cashfree

  constructor(
    container: Record<string, unknown>,
    options: CashfreeOptions
  ) {
    super(container, options)

    if (!options.appId || !options.secretKey) {
      throw new Error("Cashfree App ID and Secret Key are required")
    }

    this.options_ = options

    const environment =
      options.environment === "production"
        ? CFEnvironment.PRODUCTION
        : CFEnvironment.SANDBOX

    this.client = new Cashfree(
      environment,
      options.appId,
      options.secretKey
    )
  }

  async initiatePayment(input: any): Promise<any> {
    const context = input.context ?? {}
    const cart = context.cart ?? {}
    const customer = (context.customer ?? {}) as Customer
    const data = input.data ?? {}

    const billingAddress = (
      context.billing_address ??
      cart.billing_address ??
      {}
    ) as Address

    const shippingAddress = (
      context.shipping_address ??
      cart.shipping_address ??
      {}
    ) as Address

    // Log field availability only; do not log personal information.
    console.log("[Cashfree Debug] Payment input:", {
      inputKeys: Object.keys(input ?? {}),
      contextKeys: Object.keys(context),
      dataKeys: Object.keys(data),
      customerExists: Boolean(context.customer),
      cartExists: Boolean(context.cart),
      billingAddressExists: Boolean(
        context.billing_address ?? cart.billing_address
      ),
      shippingAddressExists: Boolean(
        context.shipping_address ?? cart.shipping_address
      ),
    })

    const phoneCandidates: unknown[] = [
      billingAddress.phone,
      shippingAddress.phone,
      customer.phone,
      context.phone,
      cart.billing_address?.phone,
      cart.shipping_address?.phone,
      data.phone,
      data.customer_phone,
    ]

    const phone = phoneCandidates.find(
      (value): value is string =>
        typeof value === "string" && value.trim().length > 0
    )

    if (!phone) {
      throw new Error(
        "Cashfree requires a customer phone number. Enter a phone number in the checkout address."
      )
    }

    const emailValue =
      customer.email ?? context.email ?? data.customer_email

    const email =
      typeof emailValue === "string" && emailValue.trim()
        ? emailValue.trim()
        : "test@example.com"

    const amount = Number(input.amount)

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Cashfree received an invalid payment amount")
    }

    const currency = String(input.currency_code ?? "").toUpperCase()

    if (currency !== "INR") {
      throw new Error(
        `Cashfree requires INR currency. Received: ${currency || "missing"}`
      )
    }

    const firstName =
      billingAddress.first_name ?? shippingAddress.first_name

    const lastName =
      billingAddress.last_name ?? shippingAddress.last_name

    const customerName =
      [firstName, lastName]
        .filter(
          (value): value is string =>
            typeof value === "string" && value.trim().length > 0
        )
        .map((value) => value.trim())
        .join(" ") || "Store Customer"

    const orderId = `medusa_${randomUUID().replace(/-/g, "")}`

    console.log("[Cashfree Debug] Creating order:", {
      orderId,
      amount,
      currency,
      phoneFound: true,
      environment: this.options_.environment ?? "sandbox",
    })

    try {
      const response = await this.client.PGCreateOrder({
        order_id: orderId,
        order_amount: amount,
        order_currency: currency,
        customer_details: {
          customer_id: String(
            customer.id ??
              `customer_${randomUUID().replace(/-/g, "")}`
          ),
          customer_email: email,
          customer_phone: phone.trim(),
          customer_name: customerName,
        },
        ...(this.options_.returnUrl
          ? {
              order_meta: {
                return_url: `${
                  this.options_.returnUrl
                }${
                  this.options_.returnUrl.includes("?") ? "&" : "?"
                }order_id=${orderId}`,
              },
            }
          : {}),
      })

      const order = response.data

      console.log("[Cashfree Debug] Order response:", {
        orderId: order?.order_id,
        paymentSessionIdReceived: Boolean(order?.payment_session_id),
        orderStatus: order?.order_status,
      })

      if (!order?.payment_session_id) {
        throw new Error(
          "Cashfree did not return a payment session ID"
        )
      }

      return {
        id: orderId,
        data: {
          order_id: orderId,
          payment_session_id: order.payment_session_id,
          order_status: order.order_status,
        },
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error"

      console.error("[Cashfree Debug] Order creation failed:", {
        message,
      })

      throw error
    }
  }

  async authorizePayment(input: any): Promise<any> {
    const orderId = input.data?.order_id

    if (!orderId) {
      throw new Error("Cashfree order ID is missing")
    }

    const response = await this.client.PGFetchOrder(orderId)
    const order = response.data

    return {
      data: {
        ...input.data,
        order_status: order.order_status,
      },
      status:
        order.order_status === "PAID"
          ? PaymentSessionStatus.AUTHORIZED
          : PaymentSessionStatus.PENDING,
    }
  }

  async getPaymentStatus(input: any): Promise<any> {
    const orderId = input.data?.order_id

    if (!orderId) {
      return { status: PaymentSessionStatus.PENDING }
    }

    const response = await this.client.PGFetchOrder(orderId)

    return {
      status:
        response.data.order_status === "PAID"
          ? PaymentSessionStatus.AUTHORIZED
          : PaymentSessionStatus.PENDING,
    }
  }

  async retrievePayment(input: any): Promise<any> {
    return { data: input.data ?? {} }
  }

  async updatePayment(input: any): Promise<any> {
    return { data: input.data ?? {} }
  }

  async deletePayment(input: any): Promise<any> {
    return { data: input.data ?? {} }
  }

  async capturePayment(input: any): Promise<any> {
    const orderId = input.data?.order_id

    if (!orderId) {
      throw new Error("Cashfree order ID is missing")
    }

    const response = await this.client.PGFetchOrder(orderId)

    if (response.data.order_status !== "PAID") {
      throw new Error("Cashfree order is not paid")
    }

    return {
      data: {
        ...input.data,
        order_status: response.data.order_status,
      },
    }
  }

  async cancelPayment(input: any): Promise<any> {
    throw new Error(
      `Cashfree cancellation is not implemented. Order: ${
        input.data?.order_id ?? "unknown"
      }`
    )
  }

  async refundPayment(_input: any): Promise<any> {
    throw new Error(
      "Cashfree refunds have not been implemented in this provider yet"
    )
  }

  async getWebhookActionAndData(_data: any): Promise<any> {
    // Add webhook signature verification before production use.
    return {
      action: PaymentActions.NOT_SUPPORTED,
    }
  }
}

export default CashfreePaymentProvider
