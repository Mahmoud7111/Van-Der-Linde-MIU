import StarRating from '@/components/common/StarRating'
import { useLanguage } from '@/context/LanguageContext'
import { formatRelativeTime, getInitials } from '@/utils/formatters'
import './ReviewCard.css'

export default function ReviewCard({ review = {}, name, rating, date, title, body }) {
  const { t } = useLanguage()
  const fallbackName = t('review.verifiedCollector')
  const rawName = name ?? review.name
  const displayName = typeof rawName === 'string' && rawName.trim() ? rawName.trim() : fallbackName

  const rawRating = rating ?? review.rating
  const numericRating = Number(rawRating)
  const hasRating = Number.isFinite(numericRating) && numericRating > 0
  const displayRating = hasRating ? numericRating : 0

  const rawDate = date ?? review.date
  const displayDate = formatRelativeTime(rawDate) || t('review.dateUnavailable')
  const displayTitle = (title ?? review.title)?.trim() || t('review.clientImpression')
  const displayBody =
    (body ?? review.body)?.trim() || t('review.defaultBody')
  const ratingLabel = hasRating
    ? t('review.ratingOutOfFive', { rating: displayRating.toFixed(1) })
    : t('review.ratingPending')

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
          {hasRating ? t('review.ratingSlashFive', { rating: displayRating.toFixed(1) }) : t('review.ratingPending')}
        </span>
      </div>

      <h3 className="review-card__title">{displayTitle}</h3>
      <p className="review-card__body">{displayBody}</p>
    </article>
  )
}
