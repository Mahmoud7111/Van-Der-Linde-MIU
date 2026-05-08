import './SkeletonCard.css'

export default function SkeletonCard() {
  return (
    <article className="skeleton-card" role="status" aria-live="polite" aria-busy="true">
      <span className="skeleton-card__sr">Loading watch details…</span>
      <div className="skeleton-card__media skeleton-card__shimmer" aria-hidden="true" />
      <div className="skeleton-card__content">
        <div className="skeleton-card__line skeleton-card__shimmer" aria-hidden="true" />
        <div className="skeleton-card__line skeleton-card__line--long skeleton-card__shimmer" aria-hidden="true" />
        <div className="skeleton-card__line skeleton-card__line--price skeleton-card__shimmer" aria-hidden="true" />
        <div className="skeleton-card__actions" aria-hidden="true">
          <span className="skeleton-card__button skeleton-card__shimmer" />
          <span className="skeleton-card__button skeleton-card__shimmer" />
        </div>
      </div>
    </article>
  )
}

// This component is a placeholder for loading content and does not contain any interactive elements or real data. It uses ARIA attributes to indicate that it is a loading state and provides a screen reader message for accessibility.