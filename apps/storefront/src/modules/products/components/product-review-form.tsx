
"use client"

import { useCallback, useEffect, useState, type FormEvent } from "react"

type Review = {
  id: string
  product_id: string
  rating: number
  comment: string
  created_at?: string
}

type Props = {
  productId: string
}

export default function ProductReviewForm({ productId }: Props) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [message, setMessage] = useState("")
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingReviews, setLoadingReviews] = useState(true)

  const backend =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

  const key = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  const fetchReviews = useCallback(async () => {
    if (!key) {
      setMessage("Publishable API key configuration missing.")
      setLoadingReviews(false)
      return
    }

    setLoadingReviews(true)

    try {
      const response = await fetch(
        `${backend}/store/products/${productId}/reviews`,
        {
          headers: {
            "x-publishable-api-key": key,
          },
          cache: "no-store",
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Could not load reviews.")
      }

      setReviews(data.reviews ?? [])
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not load reviews."
      )
    } finally {
      setLoadingReviews(false)
    }
  }, [backend, key, productId])

  useEffect(() => {
    void fetchReviews()
  }, [fetchReviews])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage("")

    if (!key) {
      setMessage("Publishable API key configuration missing.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        `${backend}/store/products/${productId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": key,
          },
          body: JSON.stringify({ rating, comment }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Could not submit review.")
      }

      setMessage("Review submitted successfully!")
      setComment("")
      setRating(5)

      await fetchReviews()
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mt-8 space-y-8 border-t border-ui-border-base pt-6">
      <div>
        <h3 className="mb-4 text-xl font-semibold">Write a Review</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="review-rating" className="mb-2 block">
              Rating
            </label>

            <select
              id="review-rating"
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
              className="rounded-md border p-2"
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} {value === 1 ? "star" : "stars"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="review-comment" className="mb-2 block">
              Your comment
            </label>

            <textarea
              id="review-comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              required
              maxLength={2000}
              rows={4}
              placeholder="Share your experience..."
              className="w-full rounded-md border p-3"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !comment.trim()}
            className="rounded-md bg-black px-5 py-3 text-white disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>

          {message && <p role="status">{message}</p>}
        </form>
      </div>

      <div>
        <h3 className="mb-4 text-xl font-semibold">Customer Reviews</h3>

        {loadingReviews ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review this product!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-lg border border-ui-border-base p-4"
              >
                <p className="mb-2 text-lg" aria-label={`${review.rating} out of 5 stars`}>
                  {"★".repeat(Math.max(0, Math.min(5, review.rating)))}
                  {"☆".repeat(5 - Math.max(0, Math.min(5, review.rating)))}
                </p>

                <p className="whitespace-pre-line">{review.comment}</p>

                {review.created_at && (
                  <p className="mt-2 text-sm text-ui-fg-muted">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
