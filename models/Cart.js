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
    giftWrappingName:  { type: String, default: '' },
    giftWrappingPrice: { type: Number, default: 0, min: 0 },
    giftCard:      { type: Boolean, default: false },
    giftCardName:  { type: String, default: '' },
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
