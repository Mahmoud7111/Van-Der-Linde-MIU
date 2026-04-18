import { Link } from 'react-router-dom'
import { FiHeart } from 'react-icons/fi'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useCurrency } from '@/context/CurrencyContext'
import { resolveWatchProductImage } from '@/utils/watchImageResolver'
import { cn } from '@/utils/cn'
import StarRating from '@/components/common/StarRating'
import Button from '@/components/common/Button'
import './ProductCard.css'

export default function ProductCard({ watch, className = '' }) {
  const { dispatch } = useCart()
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist()
  const { formatPrice } = useCurrency()

  if (!watch) return null

  const productPath = `/watch/${watch._id}`
  const primaryImage = watch.images?.[0] ?? watch.image ?? ''
  const imageUrl = resolveWatchProductImage(primaryImage)
  const numericRating = Number(watch.rating)
  const hasRating = Number.isFinite(numericRating)
  const reviewCount = Number(watch.numReviews)
  const hasReviews = Number.isFinite(reviewCount) && reviewCount > 0
  const isOutOfStock = Number.isFinite(Number(watch.stock)) && Number(watch.stock) <= 0
  const isSaved = isWishlisted(watch._id)

  const handleAddToCart = () => {
    dispatch({ type: 'ADD', payload: watch })
  }

  const handleToggleWishlist = () => {
    if (isSaved) {
      removeFromWishlist(watch._id)
      return
    }
    addToWishlist(watch)
  }

  return (
    <article className={cn('product-card', isOutOfStock && 'product-card--sold-out', className)}>
      <div className="product-card__media">
        <Link className="product-card__media-link" to={productPath} aria-label={`View ${watch.name}`}>
          <img className="product-card__image" src={imageUrl} alt={watch.name} loading="lazy" />
        </Link>

        <button
          type="button"
          className={cn('product-card__wishlist', isSaved && 'product-card__wishlist--active')}
          aria-pressed={isSaved}
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          onClick={handleToggleWishlist}
        >
          <FiHeart aria-hidden="true" fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="product-card__content">
        <p className="product-card__brand">{watch.brand}</p>
        <h3 className="product-card__name">
          <Link className="product-card__name-link" to={productPath}>
            {watch.name}
          </Link>
        </h3>

        <div className="product-card__meta">
          <span className="product-card__price">{formatPrice(watch.price)}</span>
          {hasRating && (
            <div className="product-card__rating">
              <StarRating rating={numericRating} className="product-card__stars" />
              {hasReviews && <span className="product-card__reviews">({reviewCount})</span>}
            </div>
          )}
        </div>

        <div className="product-card__actions">
          <Button className="product-card__action" to={productPath} variant="secondary" size="sm">
            View Details
          </Button>
          <Button
            className="product-card__action"
            onClick={handleAddToCart}
            variant="primary"
            size="sm"
            disabled={isOutOfStock}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </article>
  )
}