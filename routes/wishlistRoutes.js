
const router = require('express').Router()
const { getWishlist, addWatch, removeWatch } = require('../controllers/wishlistController')
const { protect } = require('../middleware/authMiddleware')

// All wishlist routes require authentication
router.get('/',           protect, getWishlist)
router.post('/',          protect, addWatch)
router.delete('/:watchId',protect, removeWatch)

module.exports = router



