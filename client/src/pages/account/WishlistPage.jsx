import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingBag, FiTrash2 } from 'react-icons/fi'
import PageTransition from '@/components/common/PageTransition'
import Button from '@/components/common/Button'
import StarRating from '@/components/common/StarRating'
import { useWishlist } from '@/context/WishlistContext'
import { useCart } from '@/context/CartContext'
import { useCurrency } from '@/context/CurrencyContext'
import { resolveFavoriteWatchImage } from '@/utils/watchImageResolver'
import './WishlistPage.css'

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist()
  const { dispatch } = useCart()
  const { formatPrice } = useCurrency()

  const handleAddToCart = (item) => {
    dispatch({ type: 'ADD', payload: item })
  }

  const handleRemove = (item) => {
    removeFromWishlist(item?._id || item?.id)
  }

  return (
    <PageTransition>
      <section className="wishlist-page">
        <div className="wishlist-page__container">
          <header className="wishlist-page__header">
            <div>
              <p className="wishlist-page__eyebrow">My Account</p>
              <h1 className="wishlist-page__title">Wishlist</h1>
            </div>

            <div className="wishlist-page__meta">
              <FiHeart aria-hidden="true" />
              <span>{wishlist.length} item{wishlist.length !== 1 ? 's' : ''}</span>
            </div>
          </header>

          {wishlist.length === 0 ? (
            <div className="wishlist-page__empty">
              <div className="wishlist-page__empty-icon" aria-hidden="true">
                <FiHeart />
              </div>
              <p>Your wishlist is empty.</p>
              <span>Save the pieces you love and find them quickly here.</span>
              <Link to="/shop" className="wishlist-page__back">
                Explore Products
              </Link>
            </div>
          ) : (
            <div className="wishlist-grid">
              {wishlist.map((item, index) => {
                const id = item?._id || item?.id || `wishlist-item-${index}`
                const name = item?.name || item?.title || 'Product'
                const image =
                  item?.image ||
                  item?.thumbnail ||
                  resolveFavoriteWatchImage(item) ||
                  item?.images?.[0] ||
                  ''
                const brand = item?.brand || 'Van Der Linde'
                const price = item?.price ?? item?.finalPrice ?? item?.salePrice ?? 0
                const oldPrice = item?.oldPrice ?? item?.compareAtPrice ?? item?.originalPrice
                const rating = Number(item?.rating ?? 0)
                const stockCount = Number(item?.stock)
                const inStock =
                  typeof item?.inStock === 'boolean'
                    ? item.inStock
                    : Number.isFinite(stockCount)
                      ? stockCount > 0
                      : true
                const href = id ? `/watch/${id}` : '/shop'

                return (
                  <article className="wishlist-card" key={id}>
                    <Link to={href} className="wishlist-card__image-wrap" aria-label={name}>
                      {image ? (
                        <img src={image} alt={name} className="wishlist-card__image" loading="lazy" />
                      ) : (
                        <div className="wishlist-card__placeholder">No Image</div>
                      )}
                    </Link>

                    <div className="wishlist-card__content">
                      <p className="wishlist-card__brand">{brand}</p>

                      <Link to={href} className="wishlist-card__name">
                        {name}
                      </Link>

                      <div className="wishlist-card__rating">
                        <StarRating value={rating} size={14} readOnly />
                      </div>

                      <div className="wishlist-card__prices">
                        <strong>{formatPrice(price)}</strong>
                        {oldPrice ? <span>{formatPrice(oldPrice)}</span> : null}
                      </div>

                      <div className="wishlist-card__stock">
                        {inStock ? 'In stock' : 'Out of stock'}
                      </div>

                      <div className="wishlist-card__actions">
                        <Button
                          type="button"
                          onClick={() => handleAddToCart(item)}
                          disabled={!inStock}
                          className="wishlist-card__cart-btn"
                        >
                          <FiShoppingBag />
                          <span>Add to Cart</span>
                        </Button>

                        <button
                          type="button"
                          className="wishlist-card__remove"
                          onClick={() => handleRemove(item)}
                          aria-label={`Remove ${name} from wishlist`}
                        >
                          <FiTrash2 />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          <Link to="/account" className="wishlist-page__account-link">
            Back to Account
          </Link>
        </div>
      </section>
    </PageTransition>
  )
}