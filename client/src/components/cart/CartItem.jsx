import { useCart } from '@/context/CartContext'
import { useCurrency } from '@/context/CurrencyContext'
import { useLanguage } from '@/context/LanguageContext'
import { cn } from '@/utils/cn'
import { resolveWatchProductImage } from '@/utils/watchImageResolver'
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi'
import './CartItem.css'

export default function CartItem({ item }) {
  const { dispatch } = useCart()
  const { formatPrice } = useCurrency()
  const { t } = useLanguage()

  // حماية من undefined item
  if (!item) return null

  const {
    _id,
    name = 'Unknown Item',
    price = 0,
    image = '',
    images = [],
    quantity = 1,
    stock,
  } = item

  const stockLimit = Number.isFinite(Number(stock)) ? stock : Infinity
  const imageUrl = resolveWatchProductImage(images?.[0] || image)

  const handleIncrease = () => {
    if (quantity < stockLimit) {
      dispatch({
        type: 'UPDATE_QTY',
        payload: { id: _id, qty: quantity + 1 },
      })
    }
  }

  const handleDecrease = () => {
    if (quantity > 1) {
      dispatch({
        type: 'UPDATE_QTY',
        payload: { id: _id, qty: quantity - 1 },
      })
    }
  }

  const handleRemove = () => {
    dispatch({ type: 'REMOVE', payload: _id })
  }

  return (
    <article className="cart-item">
      <div className="cart-item__image-wrap">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            className="cart-item__image"
          />
        )}
      </div>

      <div className="cart-item__details">
        <h4 className="cart-item__title">{name}</h4>

        <div className="cart-item__price">
          {formatPrice(price)}
        </div>

        <div className="cart-item__actions">
          <div className="cart-item__quantity-controls">
            <button
              type="button"
              className={cn(
                'cart-item__quantity-btn',
                quantity <= 1 && 'cart-item__quantity-btn--disabled'
              )}
              onClick={handleDecrease}
              disabled={quantity <= 1}
              aria-label={t('cart.decreaseQty')}
            >
              <FiMinus aria-hidden="true" />
            </button>

            <span className="cart-item__quantity-value">
              {quantity}
            </span>

            <button
              type="button"
              className={cn(
                'cart-item__quantity-btn',
                quantity >= stockLimit &&
                  'cart-item__quantity-btn--disabled'
              )}
              onClick={handleIncrease}
              disabled={quantity >= stockLimit}
              aria-label={t('cart.increaseQty')}
            >
              <FiPlus aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            className="cart-item__remove-btn"
            onClick={handleRemove}
            aria-label={t('cart.removeItem')}
          >
            <FiTrash2 aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  )
}