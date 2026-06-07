const router = require('express').Router()
const { createOrder, getMyOrders, getAllOrders, getOrderById, updateOrderStatus, validateBin, markAsPaid } = require('../controllers/orderController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

// IMPORTANT: static paths must come before /:id param routes
router.get('/mine',              protect,              getMyOrders)
router.get('/validate-bin/:bin',                       validateBin)   // public — before /:id
router.get('/',                  protect, adminOnly,   getAllOrders)
router.get('/:id',               protect,              getOrderById)
router.post('/',                 protect,              createOrder)
router.put('/:id/status',        protect, adminOnly,   updateOrderStatus)
router.put('/:id/pay',           protect, adminOnly,   markAsPaid)

module.exports = router