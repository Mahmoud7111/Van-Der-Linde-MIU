import { cn } from '@/utils/cn'
import { formatStars } from '@/utils/formatters'
import './StarRating.css'

export default function StarRating({
  rating = 0,
  maxStars = 5,
  className,
  ariaLabel,
  decorative = false,
}) {
  const numericRating = Number(rating) || 0

  return (
    <span
      className={cn('star-rating', className)}
      aria-label={decorative ? undefined : ariaLabel ?? `${numericRating.toFixed(1)} out of ${maxStars} stars`}
      aria-hidden={decorative ? 'true' : undefined}
    >
      {formatStars(numericRating, maxStars)}
    </span>
  )
}
