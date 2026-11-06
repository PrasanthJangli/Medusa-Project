
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
    <section className="mt-8 w-full min-w-0 space-y-8 overflow-hidden border-t border-ui-border-base pt-5 sm:mt-10 sm:space-y-10 sm:pt-7 md:mt-12">
      {/* WRITE A REVIEW */}
      <div className="w-full min-w-0">
        <div className="mb-4 sm:mb-5">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ui-fg-muted sm:text-xs">
            Share your experience
          </p>

          <h3 className="text-lg font-bold text-ui-fg-base sm:text-xl md:text-2xl">
            Write a Review
          </h3>

          <p className="mt-1 text-xs leading-5 text-ui-fg-muted sm:text-sm">
            Tell other customers what you think about this product.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full min-w-0 flex-col gap-4 rounded-xl border border-ui-border-base bg-white p-3 sm:gap-5 sm:p-5 md:p-6"
        >
          {/* RATING */}
          <div className="flex min-w-0 flex-col gap-2">
            <label
              htmlFor="review-rating"
              className="text-xs font-semibold text-ui-fg-base sm:text-sm"
            >
              Your Rating
            </label>

            <select
              id="review-rating"
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
              className="h-11 w-full max-w-full rounded-lg border border-ui-border-base bg-white px-3 text-sm text-ui-fg-base outline-none transition-colors focus:border-ui-fg-base focus:ring-2 focus:ring-ui-fg-base/10 sm:w-56"
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} {value === 1 ? "star" : "stars"}
                </option>
              ))}
            </select>
          </div>

          {/* COMMENT */}
          <div className="flex min-w-0 flex-col gap-2">
            <label
              htmlFor="review-comment"
              className="text-xs font-semibold text-ui-fg-base sm:text-sm"
            >
              Your Comment
            </label>

            <textarea
              id="review-comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              required
              maxLength={2000}
              rows={4}
              placeholder="Share your experience with this product..."
              className="min-h-[120px] w-full min-w-0 resize-y rounded-lg border border-ui-border-base bg-white p-3 text-sm leading-6 text-ui-fg-base outline-none transition-colors placeholder:text-ui-fg-muted focus:border-ui-fg-base focus:ring-2 focus:ring-ui-fg-base/10 sm:min-h-[140px] sm:p-4"
            />

            <p className="text-right text-[11px] text-ui-fg-muted sm:text-xs">
              {comment.length}/2000 characters
            </p>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading || !comment.trim()}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-[#17283d] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#243e58] disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit sm:min-w-[180px]"
          >
            {loading ? "Submitting..." : "Submit Review"}
            {!loading && <span className="ml-2" aria-hidden="true">→</span>}
          </button>

          {/* FEEDBACK */}
          {message && (
            <p
              role="status"
              aria-live="polite"
              className={`break-words rounded-lg px-3 py-2 text-xs leading-5 sm:text-sm ${
                message.includes("successfully")
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>

      {/* CUSTOMER REVIEWS */}
      <div className="w-full min-w-0">
        <div className="mb-4 flex min-w-0 flex-col gap-1 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ui-fg-muted sm:text-xs">
              Customer feedback
            </p>

            <h3 className="text-lg font-bold text-ui-fg-base sm:text-xl md:text-2xl">
              Customer Reviews
            </h3>
          </div>

          {!loadingReviews && reviews.length > 0 && (
            <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
            </span>
          )}
        </div>

        {loadingReviews ? (
          <div className="flex min-h-[100px] items-center justify-center rounded-xl border border-ui-border-base bg-gray-50 px-4 py-8">
            <p className="text-sm text-ui-fg-muted">
              Loading reviews...
            </p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-xl border border-dashed border-ui-border-base bg-gray-50 px-4 py-8 text-center sm:py-10">
            <p className="text-2xl" aria-hidden="true">💬</p>
            <p className="mt-2 text-sm font-semibold text-ui-fg-base">
              No reviews yet
            </p>
            <p className="mt-1 text-xs leading-5 text-ui-fg-muted sm:text-sm">
              Be the first to share your experience with this product!
            </p>
          </div>
        ) : (
          <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
            {reviews.map((review) => {
              const safeRating = Math.max(
                0,
                Math.min(5, review.rating)
              )

              return (
                <article
                  key={review.id}
                  className="w-full min-w-0 overflow-hidden rounded-xl border border-ui-border-base bg-white p-3 transition-shadow hover:shadow-sm sm:p-5"
                >
                  <div className="mb-3 flex min-w-0 flex-wrap items-center justify-between gap-2">
                    <p
                      className="text-base tracking-wide text-amber-500 sm:text-lg"
                      aria-label={`${safeRating} out of 5 stars`}
                    >
                      {"★".repeat(safeRating)}
                      {"☆".repeat(5 - safeRating)}
                    </p>

                    {review.created_at && (
                      <time
                        dateTime={review.created_at}
                        className="shrink-0 text-[11px] text-ui-fg-muted sm:text-xs"
                      >
                        {new Date(review.created_at).toLocaleDateString()}
                      </time>
                    )}
                  </div>

                  <p className="whitespace-pre-line break-words text-xs leading-6 text-ui-fg-base sm:text-sm">
                    {review.comment}
                  </p>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
