// getReviews, createReview, getAllReviews (admin), deleteReview (admin)
const Review = require('../models/Review')
const Order  = require('../models/Order')
const { assertLength } = require('../utils/validationUtils')

// ─── helpers ────────────────────────────────────────────────────────────────

const makeError = (msg, code) => {
    const err = new Error(msg)
    err.statusCode = code
    return err
}

// ─── getReviews ───────────────────────────────────────────────────────────────

const getReviews = async (watchId) => {
    return Review.find({ watch: watchId })
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
}

// ─── createReview ─────────────────────────────────────────────────────────────

const createReview = async (watchId, userId, { rating, comment }) => {
    const numericRating = Number(rating)
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
        throw makeError('Rating must be between 1 and 5', 400)
    }
    const cleanComment = assertLength(comment, 'Comment', 10, 1000)

    // Check verified purchase
    const hasOrder = await Order.findOne({
        user:   userId,
        'items.watch': watchId,
        status: 'delivered',
    })

    const review = await Review.create({
        user:               userId,
        watch:              watchId,
        rating:             numericRating,
        comment:            cleanComment,
        isVerifiedPurchase: Boolean(hasOrder),
    })

    return review
}

// ─── getAllReviews (admin) ────────────────────────────────────────────────────

const getAllReviews = async () => {
    return Review.find()
        .populate('user', 'name email')
        .populate('watch', 'name slug')
        .sort({ createdAt: -1 })
}

// ─── deleteReview (admin) ────────────────────────────────────────────────────

const deleteReview = async (reviewId) => {
    const review = await Review.findById(reviewId)
    if (!review) throw makeError('Review not found', 404)
    await review.deleteOne()
    return review
}

// ─── exports ─────────────────────────────────────────────────────────────────

module.exports = { getReviews, createReview, getAllReviews, deleteReview }
