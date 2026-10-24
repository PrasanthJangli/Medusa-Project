
import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

import { PRODUCT_REVIEW_MODULE } from "../../../../../modules/product-review"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const reviewService = req.scope.resolve(
      PRODUCT_REVIEW_MODULE
    ) as {
      createReviews: (data: {
        product_id: string
        rating: number
        comment: string
      }) => Promise<unknown>
    }

    const { rating, comment } = req.body as {
      rating: number
      comment: string
    }

    const productId = req.params.id

    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5.",
      })
    }

    if (
      typeof comment !== "string" ||
      !comment.trim()
    ) {
      return res.status(400).json({
        message: "Comment is required.",
      })
    }

    const review = await reviewService.createReviews({
      product_id: productId,
      rating,
      comment: comment.trim(),
    })

    return res.status(201).json({
      message: "Review created successfully.",
      review,
    })
  } catch (error) {
    console.error("Failed to create product review:", error)

    return res.status(500).json({
      message: "Failed to create product review.",
    })
  }
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const reviewService = req.scope.resolve(
      PRODUCT_REVIEW_MODULE
    ) as {
      listReviews: (
        filters: { product_id: string }
      ) => Promise<unknown[]>
    }

    const productId = req.params.id

    const reviews = await reviewService.listReviews({
      product_id: productId,
    })

    return res.status(200).json({
      reviews,
    })
  } catch (error) {
    console.error("Failed to fetch product reviews:", error)

    return res.status(500).json({
      message: "Failed to fetch product reviews.",
    })
  }
}
