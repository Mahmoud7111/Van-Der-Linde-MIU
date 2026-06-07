// const router = require('express').Router()

// // /watches/:id/reviews: public GET, protected POST (verified purchase)
// //! Note that we might not be doing reviews at all, but if we do, this is where they would go.

// module.exports = router


const router = require('express').Router({ mergeParams: true })
const { getReviews, createReview } = require('../controllers/reviewController')
const { protect } = require('../middleware/authMiddleware')

router.get('/',  getReviews)            // public
router.post('/', protect, createReview) // protected — verified purchase check inside service

module.exports = router
