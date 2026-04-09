/**
 * Wishlist context for saved watches.
 *
 * What this file is:
 * A global context that stores wishlist items and exposes add/remove/check helpers.
 *
 * What it does:
 * - Initializes wishlist from localStorage.
 * - Persists every change back to localStorage through one internal save helper.
 *
 * Where it is used:
 * ProductCard and ProductDetailPage call add/remove/isWishlisted for heart actions,
 * and WishlistPage reads the current list to render saved products.
 */
import { createContext, useContext, useState } from 'react'

// Create wishlist context for list state and mutation helpers.
const WishlistContext = createContext(null)

// Safely parse localStorage JSON with fallback to empty array.
const getInitialWishlist = () => {
  try {
    const rawValue = localStorage.getItem('wishlist')
    return rawValue ? JSON.parse(rawValue) : []
  } catch {
    return []
  }
}

// Provider shares wishlist state and operations with the full app.
export const WishlistProvider = ({ children }) => {
  // Restore persisted wishlist so favorites survive refreshes.
  const [wishlist, setWishlist] = useState(getInitialWishlist)

  // Single persistence helper keeps React state and localStorage in sync in one call.
  const save = (list) => {
    setWishlist(list)
    localStorage.setItem('wishlist', JSON.stringify(list))
  }

  // Add selected watch object to wishlist and persist immediately.
  const addToWishlist = (watch) => {
    save([...wishlist, watch])
  }

  // Remove item by Mongo-style `_id` and persist updated list.
  const removeFromWishlist = (id) => {
    save(wishlist.filter((item) => item._id !== id))
  }

  // Check helper used by ProductCard to decide filled vs outlined heart icon state.
  const isWishlisted = (id) => wishlist.some((item) => item._id === id)

  return (
    // Provide list data and helper methods to all descendants.
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

// Custom hook for concise wishlist access.
export const useWishlist = () => {
  const context = useContext(WishlistContext)

  // Fail fast if the hook is used outside provider scope.
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }

  return context
}
