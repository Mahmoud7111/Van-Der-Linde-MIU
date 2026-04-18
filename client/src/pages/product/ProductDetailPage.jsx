import { FiHeart } from 'react-icons/fi'
import { useLoaderData } from 'react-router-dom'
import PageTransition from '@/components/common/PageTransition'
import Button from '@/components/common/Button'
import StarRating from '@/components/common/StarRating'
import ProductImageGallery from '@/components/product/ProductImageGallery'
import ReviewCard from '@/components/product/ReviewCard'
import ReviewForm from '@/components/product/ReviewForm'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useCurrency } from '@/context/CurrencyContext'
import { resolveWatchProductImage } from '@/utils/watchImageResolver'
import { cn } from '@/utils/cn'
import './ProductDetailPage.css'

export default function ProductDetailPage() {
  const watch = useLoaderData()
  const { dispatch } = useCart()
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist()
  const { formatPrice } = useCurrency()

  if (!watch) {
    return (
      <PageTransition>
        <section className="product-detail product-detail--empty">
          <div className="product-detail__inner">
            <h1 className="product-detail__title">Watch not found</h1>
            <p className="product-detail__subtitle">The selected timepiece could not be loaded.</p>
            <Button to="/shop" variant="secondary">
              Back to Shop
            </Button>
          </div>
        </section>
      </PageTransition>
    )
  }

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
    <PageTransition>
      <section className={cn('product-detail', isOutOfStock && 'product-detail--sold-out')}>
        <div className="product-detail__inner">
          <header className="product-detail__header">
            <p className="product-detail__eyebrow">Timepiece</p>
            <div className="product-detail__heading">
              <h1 className="product-detail__title">{watch.name ?? 'Van Der Linde Watch'}</h1>
              <button
                type="button"
                className={cn('product-detail__wishlist', isSaved && 'product-detail__wishlist--active')}
                aria-pressed={isSaved}
                aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
                onClick={handleToggleWishlist}
              >
                <FiHeart aria-hidden="true" fill={isSaved ? 'currentColor' : 'none'} />
              </button>
            </div>
            <p className="product-detail__brand">{watch.brand ?? 'Van Der Linde'}</p>
          </header>

          <div className="product-detail__layout">
            <div className="product-detail__gallery">
              <div className="product-detail__image-frame">
                <img className="product-detail__image" src={imageUrl} alt={watch.name ?? 'Watch'} />
              </div>
              <div className="product-detail__gallery-panel">
                <ProductImageGallery images={watch.images ?? []} name={watch.name} />
              </div>
            </div>

            <div className="product-detail__info">
              <div className="product-detail__price-row">
                <span className="product-detail__price">{formatPrice(watch.price ?? 0)}</span>
                {hasRating && (
                  <div className="product-detail__rating">
                    <StarRating rating={numericRating} className="product-detail__stars" />
                    {hasReviews && <span className="product-detail__review-count">({reviewCount})</span>}
                  </div>
                )}
              </div>

              <p className="product-detail__description">
                {watch.description ?? 'A refined timepiece crafted for everyday luxury.'}
              </p>

              <ul className="product-detail__specs">
                <li>
                  <span>Category</span>
                  <strong>{watch.category ?? 'Luxury'}</strong>
                </li>
                <li>
                  <span>Gender</span>
                  <strong>{watch.gender ?? 'Unisex'}</strong>
                </li>
                <li>
                  <span>Availability</span>
                  <strong>{isOutOfStock ? 'Out of stock' : 'In stock'}</strong>
                </li>
              </ul>

              <div className="product-detail__actions">
                <Button onClick={handleAddToCart} variant="primary" disabled={isOutOfStock}>
                  Add to Cart
                </Button>
                <Button onClick={handleToggleWishlist} variant="secondary">
                  {isSaved ? 'Saved' : 'Save to Wishlist'}
                </Button>
              </div>
            </div>
          </div>

          <section className="product-detail__reviews">
            <div className="product-detail__reviews-header">
              <p className="product-detail__eyebrow">Reviews</p>
              <h2 className="product-detail__section-title">Collector feedback</h2>
              <p className="product-detail__section-subtitle">
                Trusted impressions from verified owners of this timepiece.
              </p>
            </div>
            <div className="product-detail__reviews-grid">
              {Array.from({ length: 2 }, (_, index) => (
                <ReviewCard key={`review-${index}`} />
              ))}
            </div>
            <div className="product-detail__review-form">
              <ReviewForm />
            </div>
          </section>
        </div>
      </section>
    </PageTransition>
  )
}