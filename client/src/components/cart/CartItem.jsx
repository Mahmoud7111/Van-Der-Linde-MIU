import { useCart } from '@/context/CartContext'
import { cn } from '@/utils/cn'
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi'
import './CartItem.css'

export default function CartItem({ item }) {
  const { dispatch } = useCart()

  // حماية من undefined item
  if (!item) return null

  const {
    _id,
    name = 'Unknown Item',
    price = 0,
    image = '',
    quantity = 1,
    stock,
  } = item

  const stockLimit = Number.isFinite(Number(stock)) ? stock : Infinity

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
        {image && (
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="cart-item__image"
          />
        )}
      </div>

      <div className="cart-item__details">
        <h4 className="cart-item__title">{name}</h4>

        <div className="cart-item__price">
          ${Number(price || 0).toFixed(2)}
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
              aria-label="Decrease quantity"
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
              aria-label="Increase quantity"
            >
              <FiPlus aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            className="cart-item__remove-btn"
            onClick={handleRemove}
            aria-label="Remove item"
          >
            <FiTrash2 aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  )
}