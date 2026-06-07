// createOrder, getMyOrders, getAllOrders, getOrderById, updateOrderStatus, validateBin, markAsPaid
const orderService = require('../services/orderService')

// POST /api/orders
const createOrder = async (req, res, next) => {
    try {
        const order = await orderService.createOrder(req.user._id, req.body)
        res.status(201).json({ success: true, message: 'Order placed', data: order })
    } catch (err) {
        next(err)
    }
}

// GET /api/orders/mine
const getMyOrders = async (req, res, next) => {
    try {
        const orders = await orderService.getMyOrders(req.user._id)
        res.status(200).json({ success: true, message: 'OK', data: orders })
    } catch (err) {
        next(err)
    }
}

// GET /api/orders — admin only
const getAllOrders = async (req, res, next) => {
    try {
        const orders = await orderService.getAllOrders()
        res.status(200).json({ success: true, message: 'OK', data: orders })
    } catch (err) {
        next(err)
    }
}

// GET /api/orders/:id
const getOrderById = async (req, res, next) => {
    try {
        const order = await orderService.getOrderById(
            req.params.id,
            req.user._id,
            req.user.role
        )
        res.status(200).json({ success: true, message: 'OK', data: order })
    } catch (err) {
        next(err)
    }
}

// PUT /api/orders/:id/status — admin only
const updateOrderStatus = async (req, res, next) => {
    try {
        const order = await orderService.updateStatus(req.params.id, req.body.status)
        res.status(200).json({ success: true, message: 'Order status updated', data: order })
    } catch (err) {
        next(err)
    }
}

// GET /api/orders/validate-bin/:bin — public
const validateBin = async (req, res, next) => {
    try {
        const result = await orderService.validateBin(req.params.bin)
        res.status(200).json({ success: true, message: 'OK', data: result })
    } catch (err) {
        next(err)
    }
}

// PUT /api/orders/:id/pay — admin only
const markAsPaid = async (req, res, next) => {
    try {
        const order = await orderService.markAsPaid(req.params.id)
        res.status(200).json({ success: true, message: 'Order marked as paid', data: order })
    } catch (err) {
        next(err)
    }
}

module.exports = { createOrder, getMyOrders, getAllOrders, getOrderById, updateOrderStatus, validateBin, markAsPaid }

