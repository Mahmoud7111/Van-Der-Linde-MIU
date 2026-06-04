// user(ref), items[{watch, qty}]
const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema({
    watch: {
        type:     mongoose.Schema.Types.ObjectId,
        ref:      'Watch',
        required: true,
    },
    qty: {
        type:    Number,
        default: 1,
        min:     1,
    },
    isGift:        { type: Boolean, default: false },
    giftWrapping:  { type: Boolean, default: false },
    giftCard:      { type: Boolean, default: false },
    recipientName: { type: String, default: '' },
    giftMessage:   { type: String, default: '' },
}, { _id: false })

const cartSchema = new mongoose.Schema({
    user: {
        type:     mongoose.Schema.Types.ObjectId,
        ref:      'User',
        required: true,
        unique:   true, // one cart per user
    },
    items: { type: [cartItemSchema], default: [] },
}, { timestamps: true })

module.exports = mongoose.model('Cart', cartSchema)
