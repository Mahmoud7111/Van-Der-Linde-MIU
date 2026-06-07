// user(ref), watch(ref), rating, comment, isVerifiedPurchase
const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    user: {
        type:     mongoose.Schema.Types.ObjectId,
        ref:      'User',
        required: true,
    },
    watch: {
        type:     mongoose.Schema.Types.ObjectId,
        ref:      'Watch',
        required: true,
    },
    rating: {
        type:     Number,
        required: [true, 'Rating is required'],
        min:      1,
        max:      5,
    },
    comment: {
        type:    String,
        default: '',
        trim:    true,
    },
    isVerifiedPurchase: {
        type:    Boolean,
        default: false,
    },
}, { timestamps: true })

// One review per user per watch
reviewSchema.index({ user: 1, watch: 1 }, { unique: true })

// After save/delete: recalculate Watch rating + numReviews
reviewSchema.statics.updateWatchRating = async function (watchId) {
    const Watch = require('./Watch')
    const stats = await this.aggregate([
        { $match: { watch: watchId } },
        { $group: { _id: '$watch', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ])
    if (stats.length > 0) {
        await Watch.findByIdAndUpdate(watchId, {
            rating:     Math.round(stats[0].avgRating * 10) / 10,
            numReviews: stats[0].count,
        })
    } else {
        await Watch.findByIdAndUpdate(watchId, { rating: 0, numReviews: 0 })
    }
}

reviewSchema.post('save', function () {
    this.constructor.updateWatchRating(this.watch)
})

reviewSchema.post('deleteOne', { document: true }, function () {
    this.constructor.updateWatchRating(this.watch)
})

module.exports = mongoose.model('Review', reviewSchema)
