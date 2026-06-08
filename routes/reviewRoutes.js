const router = require('express').Router({ mergeParams: true })
const { getReviews, createReview, getAllReviews, deleteReview } = require('../controllers/reviewController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

// Mounted at /api/watches/:watchId/reviews
router.get('/',  getReviews)             // public
router.post('/', protect, createReview)  // protected — verified purchase check inside service

// Admin: delete a specific review by ID
router.delete('/:id', protect, adminOnly, deleteReview)

module.exports = router
