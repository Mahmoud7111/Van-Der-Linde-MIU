// express-rate-limit applied to /auth, /checkout, /register, /configurator

const rateLimit = require('express-rate-limit')

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { success: false, message: 'Too many requests, try again later', data: null }
})

const chatbotLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: { success: false, message: 'Too many messages, please slow down.', data: null }
})

const configuratorLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, message: 'Too many configuration requests, please try again later.', data: null }
})

module.exports = { authLimiter, chatbotLimiter, configuratorLimiter }