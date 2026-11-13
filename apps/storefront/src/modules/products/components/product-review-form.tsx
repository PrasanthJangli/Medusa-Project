
"use client"

import { useCallback, useEffect, useState, type FormEvent } from "react"
import { useLocale } from "next-intl"

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

const translations = {
  en: {
    shareExperience: "Share your experience",
    writeReview: "Write a Review",
    tellCustomers: "Tell other customers what you think about this product.",
    yourRating: "Your Rating",
    star: "star",
    stars: "stars",
    yourComment: "Your Comment",
    placeholder: "Share your experience with this product...",
    characters: "characters",
    submitting: "Submitting...",
    submitReview: "Submit Review",
    customerFeedback: "Customer feedback",
    customerReviews: "Customer Reviews",
    review: "Review",
    reviews: "Reviews",
    loading: "Loading reviews...",
    noReviews: "No reviews yet",
    firstReview: "Be the first to share your experience with this product!",
    success: "Review submitted successfully!",
    loadError: "Could not load reviews. Please try again.",
    submitError: "Could not submit your review. Please try again.",
    generalError: "Something went wrong. Please try again.",
    missingKey: "Publishable API key configuration is missing.",
    ratingLabel: "out of 5 stars",
  },
  te: {
    shareExperience: "మీ అనుభవాన్ని పంచుకోండి",
    writeReview: "సమీక్ష రాయండి",
    tellCustomers: "ఈ ఉత్పత్తి గురించి మీ అభిప్రాయాన్ని ఇతరులకు తెలియజేయండి.",
    yourRating: "మీ రేటింగ్",
    star: "నక్షత్రం",
    stars: "నక్షత్రాలు",
    yourComment: "మీ అభిప్రాయం",
    placeholder: "ఈ ఉత్పత్తి గురించి మీ అనుభవాన్ని ఇక్కడ రాయండి...",
    characters: "అక్షరాలు",
    submitting: "సమర్పిస్తోంది...",
    submitReview: "సమీక్షను సమర్పించండి",
    customerFeedback: "వినియోగదారుల అభిప్రాయాలు",
    customerReviews: "వినియోగదారుల సమీక్షలు",
    review: "సమీక్ష",
    reviews: "సమీక్షలు",
    loading: "సమీక్షలు లోడ్ అవుతున్నాయి...",
    noReviews: "ఇంకా సమీక్షలు లేవు",
    firstReview: "ఈ ఉత్పత్తి గురించి మీ అనుభవాన్ని మొదటగా పంచుకోండి!",
    success: "మీ సమీక్ష విజయవంతంగా సమర్పించబడింది!",
    loadError: "సమీక్షలను పొందలేకపోయాము. దయచేసి మళ్లీ ప్రయత్నించండి.",
    submitError: "మీ సమీక్షను సమర్పించలేకపోయాము. దయచేసి మళ్లీ ప్రయత్నించండి.",
    generalError: "ఏదో సమస్య వచ్చింది. దయచేసి మళ్లీ ప్రయత్నించండి.",
    missingKey: "అవసరమైన అనుమతి వివరాలు అందుబాటులో లేవు.",
    ratingLabel: "5 నక్షత్రాలలో",
  },
  hi: {
    shareExperience: "अपना अनुभव साझा करें",
    writeReview: "समीक्षा लिखें",
    tellCustomers: "इस उत्पाद के बारे में अपनी राय अन्य ग्राहकों के साथ साझा करें।",
    yourRating: "आपकी रेटिंग",
    star: "सितारा",
    stars: "सितारे",
    yourComment: "आपकी टिप्पणी",
    placeholder: "इस उत्पाद के साथ अपना अनुभव यहाँ लिखें...",
    characters: "अक्षर",
    submitting: "जमा किया जा रहा है...",
    submitReview: "समीक्षा जमा करें",
    customerFeedback: "ग्राहकों की राय",
    customerReviews: "ग्राहकों की समीक्षाएँ",
    review: "समीक्षा",
    reviews: "समीक्षाएँ",
    loading: "समीक्षाएँ लोड हो रही हैं...",
    noReviews: "अभी तक कोई समीक्षा नहीं है",
    firstReview: "इस उत्पाद के बारे में अपना अनुभव साझा करने वाले पहले व्यक्ति बनें!",
    success: "आपकी समीक्षा सफलतापूर्वक जमा हो गई है!",
    loadError: "समीक्षाएँ प्राप्त नहीं हो सकीं। कृपया फिर से प्रयास करें।",
    submitError: "आपकी समीक्षा जमा नहीं हो सकी। कृपया फिर से प्रयास करें।",
    generalError: "कुछ समस्या हुई है। कृपया फिर से प्रयास करें।",
    missingKey: "आवश्यक अनुमति संबंधी जानकारी उपलब्ध नहीं है।",
    ratingLabel: "5 में से सितारे",
  },
}

export default function ProductReviewForm({ productId }: Props) {
  const locale = useLocale()
  const languageCode = locale.split("-")[0].toLowerCase()

  const t =
    translations[languageCode as keyof typeof translations] ??
    translations.en

  const dateLocale =
    languageCode === "te"
      ? "te-IN"
      : languageCode === "hi"
        ? "hi-IN"
        : "en-IN"

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("error")
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingReviews, setLoadingReviews] = useState(true)

  const backend =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

  const key = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  const fetchReviews = useCallback(async () => {
    if (!key) {
      setMessage(t.missingKey)
      setMessageType("error")
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
        throw new Error(t.loadError)
      }

      setReviews(data.reviews ?? [])
    } catch {
      setMessage(t.loadError)
      setMessageType("error")
    } finally {
      setLoadingReviews(false)
    }
  }, [backend, key, productId, t])

  useEffect(() => {
    void fetchReviews()
  }, [fetchReviews])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage("")

    if (!key) {
      setMessage(t.missingKey)
      setMessageType("error")
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

      if (!response.ok) {
        throw new Error(t.submitError)
      }

      setMessage(t.success)
      setMessageType("success")
      setComment("")
      setRating(5)

      await fetchReviews()
    } catch {
      setMessage(t.submitError)
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mt-8 w-full min-w-0 space-y-8 overflow-hidden border-t border-ui-border-base pt-5 sm:mt-10 sm:space-y-10 sm:pt-7 md:mt-12">
      <div className="w-full min-w-0">
        <div className="mb-4 sm:mb-5">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ui-fg-muted sm:text-xs">
            {t.shareExperience}
          </p>

          <h3 className="text-lg font-bold text-ui-fg-base sm:text-xl md:text-2xl">
            {t.writeReview}
          </h3>

          <p className="mt-1 text-xs leading-5 text-ui-fg-muted sm:text-sm">
            {t.tellCustomers}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full min-w-0 flex-col gap-4 rounded-xl border border-ui-border-base bg-white p-3 sm:gap-5 sm:p-5 md:p-6"
        >
          <div className="flex min-w-0 flex-col gap-2">
            <label
              htmlFor="review-rating"
              className="text-xs font-semibold text-ui-fg-base sm:text-sm"
            >
              {t.yourRating}
            </label>

            <select
              id="review-rating"
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
              className="h-11 w-full max-w-full rounded-lg border border-ui-border-base bg-white px-3 text-sm text-ui-fg-base outline-none transition-colors focus:border-ui-fg-base focus:ring-2 focus:ring-ui-fg-base/10 sm:w-56"
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} {value === 1 ? t.star : t.stars}
                </option>
              ))}
            </select>
          </div>

          <div className="flex min-w-0 flex-col gap-2">
            <label
              htmlFor="review-comment"
              className="text-xs font-semibold text-ui-fg-base sm:text-sm"
            >
              {t.yourComment}
            </label>

            <textarea
              id="review-comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              required
              maxLength={2000}
              rows={4}
              placeholder={t.placeholder}
              className="min-h-[120px] w-full min-w-0 resize-y rounded-lg border border-ui-border-base bg-white p-3 text-sm leading-6 text-ui-fg-base outline-none transition-colors placeholder:text-ui-fg-muted focus:border-ui-fg-base focus:ring-2 focus:ring-ui-fg-base/10 sm:min-h-[140px] sm:p-4"
            />

            <p className="text-right text-[11px] text-ui-fg-muted sm:text-xs">
              {comment.length}/2000 {t.characters}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !comment.trim()}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-[#17283d] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#243e58] disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit sm:min-w-[180px]"
          >
            {loading ? t.submitting : t.submitReview}
            {!loading && <span className="ml-2" aria-hidden="true">→</span>}
          </button>

          {message && (
            <p
              role="status"
              aria-live="polite"
              className={`break-words rounded-lg px-3 py-2 text-xs leading-5 sm:text-sm ${
                messageType === "success"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>

      <div className="w-full min-w-0">
        <div className="mb-4 flex min-w-0 flex-col gap-1 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ui-fg-muted sm:text-xs">
              {t.customerFeedback}
            </p>

            <h3 className="text-lg font-bold text-ui-fg-base sm:text-xl md:text-2xl">
              {t.customerReviews}
            </h3>
          </div>

          {!loadingReviews && reviews.length > 0 && (
            <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {reviews.length}{" "}
              {reviews.length === 1 ? t.review : t.reviews}
            </span>
          )}
        </div>

        {loadingReviews ? (
          <div className="flex min-h-[100px] items-center justify-center rounded-xl border border-ui-border-base bg-gray-50 px-4 py-8">
            <p className="text-sm text-ui-fg-muted">{t.loading}</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-xl border border-dashed border-ui-border-base bg-gray-50 px-4 py-8 text-center sm:py-10">
            <p className="text-2xl" aria-hidden="true">💬</p>
            <p className="mt-2 text-sm font-semibold text-ui-fg-base">
              {t.noReviews}
            </p>
            <p className="mt-1 text-xs leading-5 text-ui-fg-muted sm:text-sm">
              {t.firstReview}
            </p>
          </div>
        ) : (
          <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
            {reviews.map((review) => {
              const safeRating = Math.max(0, Math.min(5, review.rating))

              return (
                <article
                  key={review.id}
                  className="w-full min-w-0 overflow-hidden rounded-xl border border-ui-border-base bg-white p-3 transition-shadow hover:shadow-sm sm:p-5"
                >
                  <div className="mb-3 flex min-w-0 flex-wrap items-center justify-between gap-2">
                    <p
                      className="text-base tracking-wide text-amber-500 sm:text-lg"
                      aria-label={`${safeRating} ${t.ratingLabel}`}
                    >
                      {"★".repeat(safeRating)}
                      {"☆".repeat(5 - safeRating)}
                    </p>

                    {review.created_at && (
                      <time
                        dateTime={review.created_at}
                        className="shrink-0 text-[11px] text-ui-fg-muted sm:text-xs"
                      >
                        {new Date(review.created_at).toLocaleDateString(dateLocale)}
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
