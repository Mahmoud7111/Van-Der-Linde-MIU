const router = require('express').Router()
const { getCart, addItem, updateItem, removeItem, clearCart } = require('../controllers/cartController')
const { protect } = require('../middleware/authMiddleware')

// All cart routes require authentication
router.get('/',                 protect, getCart)
router.post('/items',           protect, addItem)
router.put('/items/:watchId',   protect, updateItem)
router.delete('/items/:watchId',protect, removeItem)
router.delete('/',              protect, clearCart)

module.exports = router 