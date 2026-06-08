// stock check, price calc, order document creation
const Order = require('../models/Order')
const Watch = require('../models/Watch')
const { checkStock, calculateOrderTotal, generateOrderNumber } = require('../utils/orderUtils')

// ─── helpers ────────────────────────────────────────────────────────────────

const makeError = (msg, code) => {
    const err = new Error(msg)
    err.statusCode = code
    return err
}

// Populate a cart-style items array (each has a populated watch doc) for stock checking
const populateItemsForStockCheck = async (items) => {
    return Promise.all(
        items.map(async (item) => {
            const watch = await Watch.findById(item.watch).select('name stock')
            if (!watch) throw makeError(`Watch not found: ${item.watch}`, 404)
            // checkStock expects item.watch to be the watch doc and item.qty
            return { watch, qty: item.quantity ?? item.qty }
        })
    )
}

// ─── validateBin ─────────────────────────────────────────────────────────────

const validateBin = async (bin) => {
    try {
        const res = await fetch(`https://lookup.binlist.net/${bin}`, {
            headers: { 'Accept-Version': '3' },
        })
        if (!res.ok) return { valid: false }
        const data = await res.json()
        return {
            valid:   true,
            scheme:  data.scheme  || null,
            type:    data.type    || null,
            bank:    data.bank?.name    || null,
            country: data.country?.name || null,
        }
    } catch {
        // binlist.net is rate-limited — return valid: true as fallback so
        // checkout is never blocked by a failed external call
        return { valid: true, scheme: null, bank: null, country: null }
    }
}

// ─── createOrder ─────────────────────────────────────────────────────────────

const createOrder = async (userId, { items, shippingAddress, shippingMethod, paymentMethod = 'cod', cardData }) => {
    // Populate watch docs so checkStock can read .stock and .name
    const populatedItems = await populateItemsForStockCheck(items)

    // checkStock returns { ok, failedItem } — it does NOT throw
    const stockResult = checkStock(populatedItems)
    if (!stockResult.ok) {
        throw makeError(`Insufficient stock for: ${stockResult.failedItem}`, 400)
    }

    // Map frontend shape { watch, name, price, quantity, image } → model shape (qty)
    const orderItems = items.map((item) => ({
        watch: item.watch,
        name:  item.name,
        price: item.price,
        image: item.image || '',
        qty:   item.quantity ?? item.qty,
        isGift: Boolean(item.isGift),
        giftWrapping: Boolean(item.giftWrapping),
        giftWrappingName: item.giftWrappingName || '',
        giftWrappingPrice: Math.max(0, Number(item.giftWrappingPrice) || 0),
        giftCard: Boolean(item.giftCard),
        giftCardName: item.giftCardName || '',
        recipientName: item.recipientName || '',
        giftMessage: item.giftMessage || '',
    }))

    const itemsTotal = calculateOrderTotal(orderItems)

    // Add shipping cost
    const { getRateById } = require('./shippingService')
    const shippingRate = getRateById(shippingMethod || 'standard')
    const finalTotal = itemsTotal + shippingRate.price

    // Strip sensitive card data — store only last 4 digits and scheme for display
    const cardSummary = paymentMethod === 'card' && cardData
        ? {
              last4:      String(cardData.number).slice(-4),
              scheme:     cardData.scheme     || null,
              bank:       cardData.bank       || null,
              nameOnCard: cardData.name       || null,
          }
        : null

    const order = await Order.create({
        orderNumber:   generateOrderNumber(),
        user:          userId,
        items:         orderItems,
        shippingAddress,
        totalPrice:    finalTotal,
        shippingCost:  shippingRate.price,
        paymentMethod,
        isPaid:        paymentMethod === 'card',       // card treated as paid for demo
        paidAt:        paymentMethod === 'card' ? Date.now() : null,
        cardSummary,
        status:        'pending',
    })

    // Decrement stock on each watch after order is saved
    await Promise.all(
        orderItems.map((item) =>
            Watch.findByIdAndUpdate(item.watch, { $inc: { stock: -item.qty } })
        )
    )

    return order
}

// ─── getMyOrders ─────────────────────────────────────────────────────────────

const getMyOrders = async (userId) => {
    return Order.find({ user: userId }).sort({ createdAt: -1 })
}

// ─── getAllOrders ─────────────────────────────────────────────────────────────

const getAllOrders = async () => {
    return Order.find().sort({ createdAt: -1 }).populate('user', 'name email')
}

// ─── getOrderById ─────────────────────────────────────────────────────────────

const getOrderById = async (id, userId, role) => {
    const order = await Order.findById(id)
    if (!order) throw makeError('Order not found', 404)

    // Non-admins can only view their own orders
    if (role !== 'admin' && order.user.toString() !== userId.toString()) {
        throw makeError('Not authorised to view this order', 403)
    }

    return order
}

// ─── updateStatus ─────────────────────────────────────────────────────────────

const updateStatus = async (id, status) => {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true })
    if (!order) throw makeError('Order not found', 404)
    return order
}

// ─── markAsPaid ───────────────────────────────────────────────────────────────

const markAsPaid = async (orderId) => {
    const order = await Order.findByIdAndUpdate(
        orderId,
        { isPaid: true, paidAt: Date.now() },
        { new: true }
    )
    if (!order) throw makeError('Order not found', 404)
    return order
}

// ─── exports ─────────────────────────────────────────────────────────────────

module.exports = { validateBin, createOrder, getMyOrders, getAllOrders, getOrderById, updateStatus, markAsPaid }
