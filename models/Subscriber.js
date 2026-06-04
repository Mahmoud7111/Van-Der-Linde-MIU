// email, isActive, subscribedAt, unsubscribeToken
const mongoose = require('mongoose')

const subscriberSchema = new mongoose.Schema({
    email: {
        type:      String,
        required:  [true, 'Email is required'],
        unique:    true,
        lowercase: true,
        trim:      true,
    },
    isActive: {
        type:    Boolean,
        default: true,
    },
    subscribedAt: {
        type:    Date,
        default: Date.now,
    },
    unsubscribeToken: {
        type:   String,
        unique: true,
        sparse: true,
    },
}, { timestamps: true })

module.exports = mongoose.model('Subscriber', subscriberSchema)
