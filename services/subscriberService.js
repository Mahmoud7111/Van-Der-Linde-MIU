// subscribe logic, unsubscribe token validation
const crypto = require('crypto')
const Subscriber = require('../models/Subscriber')
const { sendEmail } = require('../utils/emailService')
const { FRONTEND_URL } = require('../config/env')

// ─── helpers ────────────────────────────────────────────────────────────────

const makeError = (msg, code) => {
    const err = new Error(msg)
    err.statusCode = code
    return err
}

// ─── subscribe ───────────────────────────────────────────────────────────────

const subscribe = async (email) => {
    const existing = await Subscriber.findOne({ email: email.toLowerCase() })

    let token

    if (existing) {
        if (existing.isActive) {
            throw makeError('This email is already subscribed', 400)
        }
        // Re-subscribe — generate fresh token and reactivate
        token = crypto.randomBytes(32).toString('hex')
        existing.isActive         = true
        existing.subscribedAt     = Date.now()
        existing.unsubscribeToken = token
        await existing.save()
    } else {
        // Brand new subscriber
        token = crypto.randomBytes(32).toString('hex')
        await Subscriber.create({
            email:            email.toLowerCase(),
            isActive:         true,
            subscribedAt:     Date.now(),
            unsubscribeToken: token,
        })
    }

    // Fire-and-forget welcome email — never block the response
    try {
        await sendEmail({
            to:      email,
            subject: 'Welcome to Van Der Linde',
            html: `<p>Thank you for subscribing.</p>
                   <p><em>Crafting Legacy Since 1874.</em></p>
                   <p><a href="${FRONTEND_URL}/unsubscribe?token=${token}">Unsubscribe</a></p>`,
        })
    } catch (e) {
        console.error('Welcome email failed:', e.message)
    }

    return { message: 'Subscribed successfully' }
}

// ─── unsubscribe ─────────────────────────────────────────────────────────────

const unsubscribe = async (token) => {
    const subscriber = await Subscriber.findOne({ unsubscribeToken: token })
    if (!subscriber) throw makeError('Invalid unsubscribe link', 404)

    subscriber.isActive = false
    await subscriber.save()

    return { message: 'Unsubscribed successfully' }
}

// ─── exports ─────────────────────────────────────────────────────────────────

module.exports = { subscribe, unsubscribe }
