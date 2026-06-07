// user(ref), watches[ref]
const mongoose = require('mongoose')

const wishlistSchema = new mongoose.Schema({
    user: {
        type:     mongoose.Schema.Types.ObjectId,
        ref:      'User',
        required: true,
        unique:   true, // one wishlist per user
    },
    watches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:  'Watch',
    }],
}, { timestamps: true })

module.exports = mongoose.model('Wishlist', wishlistSchema)
