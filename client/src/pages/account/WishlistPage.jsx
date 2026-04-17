import { Link, useLoaderData } from 'react-router-dom'
import PageTransition from '@/components/common/PageTransition'
import Button from '@/components/common/Button'
import StarRating from '@/components/common/StarRating'
import Badge from '@/components/common/Badge'
import '@/styles/WishlistPage.css'

function formatPrice(value) {
  const n = Number(value || 0)
  return `$${n.toFixed(2)}`
}

export default function WishlistPage() {
  const loaderData = useLoaderData()
  const wishlist = Array.isArray(loaderData)
    ? loaderData
    : Array.isArray(loaderData?.items)
      ? loaderData.items
      : []

  return (
    <PageTransition>
      <section className="wishlist-page">
        <div className="wishlist-page__container">
          <header className="wishlist-page__header">
            <p className="wishlist-page__eyebrow">My Account</p>
            <h1 className="wishlist-page__title">Wishlist</h1>
          </header>

          {wishlist.length === 0 ? (
            <div className="wishlist-page__empty">
              <p>Your wishlist is empty.</p>
              <Link to="/products" className="wishlist-page__back">
                Explore Products
              </Link>
            </div>
          ) : (
            <div className="wishlist-grid">
              {wishlist.map((item) => {
                const id = item?._id || item?.id
                const name = item?.name || 'Product'
                const image = item?.image || item?.thumbnail || ''
                const brand = item?.brand || 'Van Der Linde'
                const price = item?.price ?? item?.finalPrice ?? 0
                const oldPrice = item?.oldPrice ?? item?.compareAtPrice
                const rating = item?.rating ?? 0
                const isNew = Boolean(item?.isNew)

                return (
                  <article className="wishlist-card" key={id || name}>
                    <Link to={`/products/${id}`} className="wishlist-card__image-wrap">
                      {image ? (
                        <img src={image} alt={name} className="wishlist-card__image" />
                      ) : (
                        <div className="wishlist-card__placeholder">No Image</div>
                      )}
                      {isNew && (
                        <div className="wishlist-card__badge">
                          <Badge variant="primary" size="sm">New</Badge>
                        </div>
                      )}
                    </Link>

                    <div className="wishlist-card__content">
                      <p className="wishlist-card__brand">{brand}</p>
                      <Link to={`/products/${id}`} className="wishlist-card__name">
                        {name}
                      </Link>

                      <div className="wishlist-card__rating">
                        <StarRating value={rating} size={14} readOnly />
                      </div>

                      <div className="wishlist-card__prices">
                        <strong>{formatPrice(price)}</strong>
                        {oldPrice ? <span>{formatPrice(oldPrice)}</span> : null}
                      </div>

                      <div className="wishlist-card__actions">
                        <Button type="button">Add to Cart</Button>
                        <button type="button" className="wishlist-card__remove">
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          <Link to="/account" className="wishlist-page__back">
            Back to Account
          </Link>
        </div>
      </section>
    </PageTransition>
  )
}