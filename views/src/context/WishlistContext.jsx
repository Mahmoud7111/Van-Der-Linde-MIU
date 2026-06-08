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
import { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast' //Used for user notification
import { useAuth } from '@/context/AuthContext'
import { wishlistService } from '@/services/wishlistService'


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
  const { user } = useAuth()

  // Single persistence helper keeps React state and localStorage in sync in one call.
  const save = (list) => {
    setWishlist(list)
    localStorage.setItem('wishlist', JSON.stringify(list))
  }

  // Read canonical identifier across backend and mock shapes.
  const getItemId = (item) => item?._id || item?.id

  const normalizeServerWishlist = (serverWishlist) => {
    return Array.isArray(serverWishlist?.watches) ? serverWishlist.watches : []
  }

  useEffect(() => {
    const loadServerWishlist = async () => {
      if (!user) return

      try {
        save(normalizeServerWishlist(await wishlistService.getWishlist()))
      } catch (err) {
        toast.error(err.message || 'Could not load wishlist')
      }
    }

    loadServerWishlist()
  }, [user])

  // Add selected watch object to wishlist and persist immediately.
  const addToWishlist = async (watch) => {
    const watchId = getItemId(watch)

    // Skip duplicates so wishlist count/cards remain stable.
    if (watchId && wishlist.some((item) => getItemId(item) === watchId)) {
      return
    }

    if (!user) {
      save([...wishlist, watch])
      toast.success('Added to wishlist')
      return
    }

    try {
      const serverWishlist = await wishlistService.addWatch(watchId)
      save(normalizeServerWishlist(serverWishlist))
      toast.success('Added to wishlist')
    } catch (err) {
      toast.error(err.message || 'Could not update wishlist')
    }

  }

  // Remove item by Mongo-style `_id` and persist updated list.
  const removeFromWishlist = async (id) => {
    if (!user) {
      save(wishlist.filter((item) => getItemId(item) !== id))
      toast.success('Removed from wishlist')
      return
    }

    try {
      const serverWishlist = await wishlistService.removeWatch(id)
      save(normalizeServerWishlist(serverWishlist))
      toast.success('Removed from wishlist')
    } catch (err) {
      toast.error(err.message || 'Could not update wishlist')
    }
  }

  // Check helper used by ProductCard to decide filled vs outlined heart icon state.
  const isWishlisted = (id) => wishlist.some((item) => getItemId(item) === id)

  return (
    // Provide list data and helper methods to all descendants.
    <WishlistContext.Provider
      value={{
        wishlist,
        totalItems: wishlist.length,
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

