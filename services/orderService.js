// stock check, price calc, order document creation
const Order = require('../models/Order')
const Watch = require('../models/Watch')
const { checkStock, calculateOrderTotal, generateOrderNumber } = require('../utils/orderUtils')
const { assertLength, cleanString, isEmail, isPhone, isPostalCode } = require('../utils/validationUtils')

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

const luhnCheck = (value) => {
    const digits = cleanString(value).replace(/\D/g, '')
    let sum = 0
    let shouldDouble = false

    for (let i = digits.length - 1; i >= 0; i -= 1) {
        let digit = Number(digits[i])
        if (shouldDouble) {
            digit *= 2
            if (digit > 9) digit -= 9
        }
        sum += digit
        shouldDouble = !shouldDouble
    }

    return digits.length >= 13 && digits.length <= 19 && sum % 10 === 0
}

const normaliseOrderInput = ({ items, shippingAddress, paymentMethod = 'cod', cardData } = {}) => {
    if (!Array.isArray(items) || items.length === 0) throw makeError('Order must include at least one item', 400)

    const cleanItems = items.map((item) => {
        const watch = cleanString(item.watch)
        const name = assertLength(item.name, 'Item name', 1, 120)
        const price = Number(item.price)
        const qty = Number(item.quantity ?? item.qty)

        if (!watch) throw makeError('Each order item must include a watch id', 400)
        if (!Number.isFinite(price) || price < 0) throw makeError('Each order item must include a valid price', 400)
        if (!Number.isInteger(qty) || qty < 1) throw makeError('Each order item must include a valid quantity', 400)

        return { ...item, watch, name, price, quantity: qty, qty }
    })

    const cleanShippingAddress = {
        fullName: assertLength(shippingAddress?.fullName || shippingAddress?.name, 'Full name', 2, 80),
        street:   assertLength(shippingAddress?.street, 'Street', 5, 160),
        city:     assertLength(shippingAddress?.city, 'City', 2, 80),
        state:    cleanString(shippingAddress?.state),
        zip:      cleanString(shippingAddress?.zip || shippingAddress?.postalCode),
        country:  assertLength(shippingAddress?.country, 'Country', 2, 80),
        phone:    cleanString(shippingAddress?.phone),
    }

    if (!isPostalCode(cleanShippingAddress.zip)) throw makeError('Please enter a valid postal code', 400)
    if (cleanShippingAddress.phone && !isPhone(cleanShippingAddress.phone)) throw makeError('Please enter a valid phone number', 400)
    if (shippingAddress?.email && !isEmail(shippingAddress.email)) throw makeError('Please enter a valid email', 400)

    const cleanPaymentMethod = paymentMethod === 'card' ? 'card' : 'cod'
    if (cleanPaymentMethod === 'card') {
        if (!cardData || !luhnCheck(cardData.number)) throw makeError('Please enter a valid card number', 400)
        if (cleanString(cardData.name).length < 2) throw makeError('Cardholder name is required', 400)
    }

    return {
        items: cleanItems,
        shippingAddress: cleanShippingAddress,
        paymentMethod: cleanPaymentMethod,
        cardData,
    }
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

const createOrder = async (userId, payload) => {
    const { items, shippingAddress, paymentMethod, cardData } = normaliseOrderInput(payload)
    const shippingMethod = payload?.shippingMethod

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
