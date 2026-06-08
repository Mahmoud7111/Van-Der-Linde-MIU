// shipping rate calculation — hardcoded, no DB model needed
const SHIPPING_RATES = [
    {
        id:          'standard',
        label:       'Standard Delivery',
        description: '5–7 business days',
        price:       0,
    },
    {
        id:          'express',
        label:       'Express Delivery',
        description: '2–3 business days',
        price:       25,
    },
    {
        id:          'international',
        label:       'International Shipping',
        description: '10–14 business days',
        price:       50,
    },
]

const getRates = () => SHIPPING_RATES

const getRateById = (id) => {
    const rate = SHIPPING_RATES.find((r) => r.id === id)
    if (!rate) {
        const err = new Error('Invalid shipping method')
        err.statusCode = 400
        throw err
    }
    return rate
}

module.exports = { getRates, getRateById }
