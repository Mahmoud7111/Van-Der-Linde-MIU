import StarRating from '@/components/common/StarRating'
import { formatRelativeTime, getInitials } from '@/utils/formatters'
import './ReviewCard.css'

export default function ReviewCard({ review = {}, name, rating, date, title, body }) {
  const fallbackName = 'Verified Collector'
  const rawName = name ?? review.name
  const displayName = typeof rawName === 'string' && rawName.trim() ? rawName.trim() : fallbackName

  const rawRating = rating ?? review.rating
  const numericRating = Number(rawRating)
  const hasRating = Number.isFinite(numericRating) && numericRating > 0
  const displayRating = hasRating ? numericRating : 0

  const rawDate = date ?? review.date
  const displayDate = formatRelativeTime(rawDate) || 'Date unavailable'
  const displayTitle = (title ?? review.title)?.trim() || 'Client impression'
  const displayBody =
    (body ?? review.body)?.trim() || 'Review details will be available once collectors share their feedback.'
  const ratingLabel = hasRating ? `${displayRating.toFixed(1)} out of 5 stars` : 'Rating pending'

  return (
    <article className="review-card">
      <div className="review-card__header">
        <div className="review-card__avatar" aria-hidden="true">
          {getInitials(displayName)}
        </div>
        <div className="review-card__meta">
          <p className="review-card__name">{displayName}</p>
          <p className="review-card__date">{displayDate}</p>
        </div>
      </div>

      <div className="review-card__rating">
        <StarRating rating={displayRating} className="review-card__stars" ariaLabel={ratingLabel} />
        <span className="review-card__rating-text">
          {hasRating ? `${displayRating.toFixed(1)} / 5` : 'Rating pending'}
        </span>
      </div>

      <h3 className="review-card__title">{displayTitle}</h3>
      <p className="review-card__body">{displayBody}</p>
    </article>
  )
}
