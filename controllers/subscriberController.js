// subscribe, unsubscribe
const subscriberService = require('../services/subscriberService')

// POST /api/subscribers — body: { email }
const subscribe = async (req, res, next) => {
    try {
        const result = await subscriberService.subscribe(req.body.email)
        res.status(200).json({ success: true, message: result.message, data: null })
    } catch (err) {
        next(err)
    }
}

// DELETE /api/subscribers/:token
const unsubscribe = async (req, res, next) => {
    try {
        const result = await subscriberService.unsubscribe(req.params.token)
        res.status(200).json({ success: true, message: result.message, data: null })
    } catch (err) {
        next(err)
    }
}

module.exports = { subscribe, unsubscribe }
