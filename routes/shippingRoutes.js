// /shipping: GET rates, GET rate by id — public
const router = require('express').Router()
const { getRates, getRateById } = require('../controllers/shippingController')

router.get('/rates',     getRates)
router.get('/rates/:id', getRateById)

module.exports = router