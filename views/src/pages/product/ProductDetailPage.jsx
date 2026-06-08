import { motion } from 'framer-motion'
import { FiHeart } from 'react-icons/fi'
import { useLoaderData } from 'react-router-dom'
import PageTransition from '@/components/common/PageTransition'
import Button from '@/components/common/Button'
import StarRating from '@/components/common/StarRating'
import ReviewCard from '@/components/product/ReviewCard'
import ReviewForm from '@/components/product/ReviewForm'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useCurrency } from '@/context/CurrencyContext'
import { useLanguage } from '@/context/LanguageContext'
import { resolveWatchProductImage } from '@/utils/watchImageResolver'
import { cn } from '@/utils/cn'
import './ProductDetailPage.css'

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const CATEGORY_KEYS = new Set(['luxury', 'sport', 'classic', 'smart'])

const getTranslatedCategory = (category, t) => {
  if (typeof category !== 'string' || !category.trim()) {
    return t('product.luxury')
  }

  const normalized = category.trim().toLowerCase()
  return CATEGORY_KEYS.has(normalized) ? t(`category.${normalized}`) : category
}

const getTranslatedGender = (gender, t) => {
  if (typeof gender !== 'string' || !gender.trim()) {
    return t('product.unisex')
  }

  const normalized = gender.trim().toLowerCase()

  if (normalized === 'men' || normalized === 'women') {
    return t(`filter.${normalized}`)
  }

  if (normalized === 'unisex') {
    return t('product.unisex')
  }

  return gender
}

export default function ProductDetailPage() {
  const watch = useLoaderData()
  const { dispatch } = useCart()
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist()
  const { formatPrice } = useCurrency()
  const { t } = useLanguage()

  if (!watch) {
    return (
      <PageTransition>
        <section className="product-detail product-detail--empty">
          <div className="product-detail__inner">
            <h1 className="product-detail__title">{t('product.notFound')}</h1>
            <p className="product-detail__subtitle">{t('product.notFoundMessage')}</p>
            <Button to="/shop" variant="secondary">
              {t('product.backToShop')}
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
  const displayCategory = getTranslatedCategory(watch.category, t)
  const displayGender = getTranslatedGender(watch.gender, t)

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

  const imageMotionProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.92, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        transition: { duration: 0.7, ease: 'easeOut' },
      }

  const infoMotionProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: 'easeOut', delay: 0.2 },
      }

  return (
    <PageTransition>
      <section className={cn('product-detail', isOutOfStock && 'product-detail--sold-out')}>
        <div className="product-detail__inner">
          <header className="product-detail__header">
            <p className="product-detail__eyebrow">{t('product.timepiece')}</p>
            <div className="product-detail__heading">
              <h1 className="product-detail__title">{watch.name ?? t('product.watchFallbackName')}</h1>
              <button
                type="button"
                className={cn('product-detail__wishlist', isSaved && 'product-detail__wishlist--active')}
                aria-pressed={isSaved}
                aria-label={isSaved ? t('product.removeFromWishlist') : t('product.saveToWishlist')}
                onClick={handleToggleWishlist}
              >
                <FiHeart aria-hidden="true" fill={isSaved ? 'currentColor' : 'none'} />
              </button>
            </div>
            <p className="product-detail__brand">{(typeof watch.brand === 'object' ? watch.brand?.name : watch.brand) ?? 'Van Der Linde'}</p>
          </header>

          <div className="product-detail__layout">
            <div className="product-detail__gallery">
              <motion.div className="product-detail__image-frame" {...imageMotionProps}>
                <img className="product-detail__image" src={imageUrl} alt={watch.name ?? t('product.watchFallbackAlt')} />
              </motion.div>
            </div>

            <motion.div className="product-detail__info" {...infoMotionProps}>
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
                {watch.description ?? t('product.defaultDescription')}
              </p>

              <ul className="product-detail__specs">
                <li>
                  <span>{t('product.category')}</span>
                  <strong>{displayCategory}</strong>
                </li>
                <li>
                  <span>{t('product.gender')}</span>
                  <strong>{displayGender}</strong>
                </li>
                <li>
                  <span>{t('product.availability')}</span>
                  <strong>{isOutOfStock ? t('product.outOfStock') : t('product.inStock')}</strong>
                </li>
              </ul>

              <div className="product-detail__actions">
                <Button onClick={handleAddToCart} variant="primary" disabled={isOutOfStock}>
                  {t('btn.addToCart')}
                </Button>
                <Button onClick={handleToggleWishlist} variant="secondary">
                  {isSaved ? t('product.saved') : t('product.saveToWishlistButton')}
                </Button>
              </div>
            </motion.div>
          </div>

          <section className="product-detail__reviews">
            <div className="product-detail__reviews-header">
              <p className="product-detail__eyebrow">{t('product.reviews')}</p>
              <h2 className="product-detail__section-title">{t('product.collectorFeedback')}</h2>
              <p className="product-detail__section-subtitle">
                {t('product.reviewsSubtitle')}
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
