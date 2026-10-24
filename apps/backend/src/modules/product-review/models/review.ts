import { model } from "@medusajs/framework/utils"

const Review = model.define("product_review", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  rating: model.number(),
  comment: model.text(),
})

export default Review