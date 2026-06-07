// getCart, addItem, updateItem, removeItem, clearCart
const cartService = require('../services/cartService')

// GET /api/cart
const getCart = async (req, res, next) => {
    try {
        const cart = await cartService.getCart(req.user._id)
        res.status(200).json({ success: true, message: 'OK', data: cart })
    } catch (err) {
        next(err)
    }
}

// POST /api/cart/items — body: { watchId, quantity }
const addItem = async (req, res, next) => {
    try {
        const { watchId, quantity } = req.body
        const cart = await cartService.addItem(req.user._id, watchId, quantity)
        res.status(200).json({ success: true, message: 'Item added to cart', data: cart })
    } catch (err) {
        next(err)
    }
}

// PUT /api/cart/items/:watchId — body: { quantity }
const updateItem = async (req, res, next) => {
    try {
        const { quantity } = req.body
        const cart = await cartService.updateItem(req.user._id, req.params.watchId, quantity)
        res.status(200).json({ success: true, message: 'Cart updated', data: cart })
    } catch (err) {
        next(err)
    }
}

// DELETE /api/cart/items/:watchId
const removeItem = async (req, res, next) => {
    try {
        const cart = await cartService.removeItem(req.user._id, req.params.watchId)
        res.status(200).json({ success: true, message: 'Item removed', data: cart })
    } catch (err) {
        next(err)
    }
}

// DELETE /api/cart
const clearCart = async (req, res, next) => {
    try {
        await cartService.clearCart(req.user._id)
        res.status(200).json({ success: true, message: 'Cart cleared', data: null })
    } catch (err) {
        next(err)
    }
}

module.exports = { getCart, addItem, updateItem, removeItem, clearCart }
