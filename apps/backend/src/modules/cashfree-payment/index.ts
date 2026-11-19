import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import CashfreePaymentProvider from "./service"

export default ModuleProvider(Modules.PAYMENT, {
  services: [CashfreePaymentProvider],
})