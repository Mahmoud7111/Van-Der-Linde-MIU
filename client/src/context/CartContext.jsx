/**
 * Cart context powered by useReducer.
 *
 * What this file is:
 * A global cart state manager for add/remove/update/clear operations.
 *
 * What it does:
 * - Uses a reducer for predictable multi-step cart transitions.
 * - Persists cart contents in localStorage.
 * - Computes `totalItems` and `totalPrice` for quick UI access.
 *
 * Where it is used:
 * `dispatch` is used by ProductCard, ProductDetailPage, and CartItem.
 * `totalItems` is displayed in Header cart badge.
 */
import { createContext, useContext, useEffect, useReducer } from 'react'

// Create cart context for reducer state and computed totals.
const CartContext = createContext(null)

// Helper to normalize stock limits; missing stock defaults to Infinity to avoid accidental NaN capping.
const getStockLimit = (item) => (Number.isFinite(Number(item?.stock)) ? Number(item.stock) : Infinity)

// Reducer handles all cart operations with explicit action cases.
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD': {
      // Incoming item to add to cart.
      const incomingItem = action.payload

      // Find existing item by Mongo-style `_id`.
      const existingItem = state.find((item) => item._id === incomingItem._id)

      // If item already exists, increment quantity but never exceed available stock.
      if (existingItem) {
        return state.map((item) => {
          if (item._id !== incomingItem._id) return item

          const stockLimit = getStockLimit(item)
          const nextQuantity = Math.min(item.quantity + 1, stockLimit)

          return { ...item, quantity: nextQuantity }
        })
      }

      // New item starts with quantity 1 and should not exceed stock cap.
      const initialQuantity = Math.min(1, getStockLimit(incomingItem))
      return [...state, { ...incomingItem, quantity: initialQuantity }]
    }

    case 'REMOVE': {
      // Remove entire cart line by `_id`.
      return state.filter((item) => item._id !== action.payload)
    }

    case 'UPDATE_QTY': {
      // Payload contains target item id and desired quantity.
      const { id, qty } = action.payload

      return state.map((item) => {
        if (item._id !== id) return item

        // Clamp quantity between 1 and stock limit to prevent over-ordering.
        const stockLimit = getStockLimit(item)
        const normalizedQty = Math.max(1, Math.min(Number(qty), stockLimit))

        return { ...item, quantity: normalizedQty }
      })
    }

    case 'CLEAR': {
      // Used after successful checkout to empty cart state.
      return []
    }

    default: {
      // Unknown action leaves state unchanged.
      return state
    }
  }
}

// Safe localStorage parser for initial cart hydration.
const getInitialCart = () => {
  try {
    const rawValue = localStorage.getItem('cart')
    return rawValue ? JSON.parse(rawValue) : []
  } catch {
    return []
  }
}

// Provider exposes cart state, dispatcher, and computed totals.
export const CartProvider = ({ children }) => {
  // Initialize reducer state from localStorage so cart survives page refresh.
  const [cart, dispatch] = useReducer(cartReducer, [], getInitialCart)

  useEffect(() => {
    // Persist every cart update to localStorage.
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  // Total quantity for cart badge and checkout step indicators.
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Total price used in cart summary and checkout review screens.
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    // Expose reducer data + dispatcher so cart operations stay centralized and predictable.
    <CartContext.Provider value={{ cart, dispatch, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

// Custom hook for clean cart context access.
export const useCart = () => {
  const context = useContext(CartContext)

  // Guard against usage outside provider tree.
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }

  return context
}
