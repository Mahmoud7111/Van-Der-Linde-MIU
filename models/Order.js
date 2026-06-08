// user(ref), items[], shippingAddress, totalPrice, status, paymentResult, isPaid
const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
    watch: {
        type:     mongoose.Schema.Types.ObjectId,
        ref:      'Watch',
        required: true,
    },
    name:  { type: String, required: true },  // snapshot at time of order
    image: { type: String, default: '' },     // snapshot
    price: { type: Number, required: true },  // snapshot
    qty:   { type: Number, required: true, min: 1 },
    isGift:        { type: Boolean, default: false },
    giftWrapping:  { type: Boolean, default: false },
    giftWrappingName:  { type: String, default: '' },
    giftWrappingPrice: { type: Number, default: 0, min: 0 },
    giftCard:      { type: Boolean, default: false },
    giftCardName:  { type: String, default: '' },
    recipientName: { type: String, default: '' },
    giftMessage:   { type: String, default: '' },
}, { _id: false })

const shippingAddressSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    street:   { type: String, required: true },
    city:     { type: String, required: true },
    state:    { type: String, default: '' },
    zip:      { type: String, required: true },
    country:  { type: String, required: true },
    phone:    { type: String, default: '' },
}, { _id: false })

const paymentResultSchema = new mongoose.Schema({
    id:       String,
    status:   String,
    provider: { type: String, default: 'cash' }, // 'stripe' | 'cash'
    email:    String,
    paidAt:   Date,
}, { _id: false })

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type:   String,
        unique: true,
    },
    user: {
        type:     mongoose.Schema.Types.ObjectId,
        ref:      'User',
        required: true,
    },
    items:           { type: [orderItemSchema], required: true },
    shippingAddress: { type: shippingAddressSchema, required: true },
    totalPrice: {
        type:     Number,
        required: true,
        min:      0,
    },
    status: {
        type:    String,
        enum:    ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
    paymentMethod: {
        type:    String,
        enum:    ['card', 'cod'],
        default: 'cod',
    },
    shippingCost: {
        type:    Number,
        default: 0,
    },
    cardSummary: {
        last4:      String,
        scheme:     String,
        bank:       String,
        nameOnCard: String,
    },
    paymentResult: { type: paymentResultSchema },
    isPaid:        { type: Boolean, default: false },
    paidAt:        { type: Date },
    isDelivered:   { type: Boolean, default: false },
    deliveredAt:   { type: Date },
    notes:         { type: String, default: '' },
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)
