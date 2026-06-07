

// getReviews, createReview
const reviewService = require('../services/reviewService')

// GET /api/watches/:watchId/reviews
const getReviews = async (req, res, next) => {
    try {
        const reviews = await reviewService.getReviews(req.params.watchId)
        res.status(200).json({ success: true, message: 'OK', data: reviews })
    } catch (err) {
        next(err)
    }
}

// POST /api/watches/:watchId/reviews
const createReview = async (req, res, next) => {
    try {
        const review = await reviewService.createReview(
            req.params.watchId,
            req.user._id,
            req.body
        )
        res.status(201).json({ success: true, message: 'Review submitted', data: review })
    } catch (err) {
        next(err)
    }
}

module.exports = { getReviews, createReview }
