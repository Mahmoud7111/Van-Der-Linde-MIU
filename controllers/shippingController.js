// getShippingRates, getShippingRateById
const shippingService = require('../services/shippingService')

// GET /api/shipping/rates
const getRates = (req, res, next) => {
    try {
        const rates = shippingService.getRates()
        res.status(200).json({ success: true, message: 'OK', data: rates })
    } catch (err) {
        next(err)
    }
}

// GET /api/shipping/rates/:id
const getRateById = (req, res, next) => {
    try {
        const rate = shippingService.getRateById(req.params.id)
        res.status(200).json({ success: true, message: 'OK', data: rate })
    } catch (err) {
        next(err)
    }
}

module.exports = { getRates, getRateById }
