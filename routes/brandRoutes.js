const router = require('express').Router()
const { getBrands } = require('../controllers/brandController')

router.get('/', getBrands)

module.exports = router
