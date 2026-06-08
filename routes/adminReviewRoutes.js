// Admin-level global reviews route (GET all, DELETE by id)
const router = require('express').Router()
const { getAllReviews, deleteReview } = require('../controllers/reviewController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

// GET /api/reviews  — admin list all reviews
router.get('/', protect, adminOnly, getAllReviews)

// DELETE /api/reviews/:id — admin delete review
router.delete('/:id', protect, adminOnly, deleteReview)

module.exports = router
