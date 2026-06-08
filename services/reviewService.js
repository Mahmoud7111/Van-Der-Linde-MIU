// getReviews, createReview, getAllReviews (admin), deleteReview (admin)
const Review = require('../models/Review')
const Order  = require('../models/Order')

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
    // Check verified purchase
    const hasOrder = await Order.findOne({
        user:   userId,
        'items.watch': watchId,
        status: 'delivered',
    })

    const review = await Review.create({
        user:               userId,
        watch:              watchId,
        rating:             Number(rating),
        comment:            comment || '',
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
