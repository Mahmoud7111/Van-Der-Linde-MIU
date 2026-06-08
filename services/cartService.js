// getCart, addItem, updateItem, removeItem, clearCart
const Cart = require('../models/Cart')
const Watch = require('../models/Watch')

// ─── helpers ────────────────────────────────────────────────────────────────

const makeError = (msg, code) => {
    const err = new Error(msg)
    err.statusCode = code
    return err
}

// Shared populate config — frontend reads item.watch.name, item.watch.images[0], item.watch.price
const populateCart = (cartQuery) =>
    cartQuery.populate('items.watch', 'name images price stock')

const normalizeGiftOptions = (giftOptions = {}) => ({
    isGift: Boolean(giftOptions.isGift),
    giftWrapping: Boolean(giftOptions.giftWrapping),
    giftWrappingName: String(giftOptions.giftWrappingName || '').trim(),
    giftWrappingPrice: Math.max(0, Number(giftOptions.giftWrappingPrice) || 0),
    giftCard: Boolean(giftOptions.giftCard),
    giftCardName: String(giftOptions.giftCardName || '').trim(),
    recipientName: String(giftOptions.recipientName || '').trim(),
    giftMessage: String(giftOptions.giftMessage || '').trim(),
})

// ─── getCart ─────────────────────────────────────────────────────────────────

const getCart = async (userId) => {
    const cart = await populateCart(Cart.findOne({ user: userId }))
    return cart || { items: [] }
}

// ─── addItem ─────────────────────────────────────────────────────────────────

const addItem = async (userId, watchId, quantity, giftOptions = {}) => {
    const watch = await Watch.findById(watchId)
    if (!watch) throw makeError('Watch not found', 404)
    if (watch.stock < quantity) throw makeError('Insufficient stock', 400)
    const normalizedGiftOptions = normalizeGiftOptions(giftOptions)

    let cart = await Cart.findOne({ user: userId })
    if (!cart) {
        cart = new Cart({ user: userId, items: [] })
    }

    const existingIndex = cart.items.findIndex(
        (item) => item.watch.toString() === watchId
    )

    if (existingIndex > -1) {
        // Item already in cart — increment, capped at available stock
        const newQty = cart.items[existingIndex].qty + quantity
        cart.items[existingIndex].qty = Math.min(newQty, watch.stock)
        if (normalizedGiftOptions.isGift) {
            Object.assign(cart.items[existingIndex], normalizedGiftOptions)
        }
    } else {
        // New item
        cart.items.push({ watch: watchId, qty: quantity, ...normalizedGiftOptions })
    }

    await cart.save()
    return populateCart(Cart.findById(cart._id))
}

// ─── updateItem ──────────────────────────────────────────────────────────────

const updateItem = async (userId, watchId, quantity) => {
    const cart = await Cart.findOne({ user: userId })
    if (!cart) throw makeError('Cart not found', 404)

    const itemIndex = cart.items.findIndex(
        (item) => item.watch.toString() === watchId
    )
    if (itemIndex === -1) throw makeError('Item not in cart', 404)

    if (quantity <= 0) {
        // Remove item when quantity drops to zero
        cart.items.splice(itemIndex, 1)
    } else {
        cart.items[itemIndex].qty = quantity
    }

    await cart.save()
    return populateCart(Cart.findById(cart._id))
}

// ─── removeItem ──────────────────────────────────────────────────────────────

const removeItem = async (userId, watchId) => {
    const cart = await Cart.findOne({ user: userId })
    if (!cart) return { items: [] }

    cart.items = cart.items.filter((item) => item.watch.toString() !== watchId)
    await cart.save()
    return populateCart(Cart.findById(cart._id))
}

// ─── clearCart ───────────────────────────────────────────────────────────────

const clearCart = async (userId) => {
    await Cart.findOneAndUpdate({ user: userId }, { items: [] })
}

// ─── exports ─────────────────────────────────────────────────────────────────

module.exports = { getCart, addItem, updateItem, removeItem, clearCart }

