// calculateOrderTotal(items), generateOrderNumber(), checkStock(items)

/**
 * Calculate total price of an order from its items array.
 * @param {Array<{price: number, qty: number}>} items
 * @returns {number} total rounded to 2 decimal places
 */
const calculateOrderTotal = (items = []) => {
    const total = items.reduce((sum, item) => {
        const itemPrice = Number(item.price) || 0
        const giftWrappingPrice = Number(item.giftWrappingPrice) || 0
        const qty = Number(item.qty) || 1
        return sum + (itemPrice + giftWrappingPrice) * qty
    }, 0)
    return Math.round(total * 100) / 100
}

/**
 * Generate a unique human-readable order number.
 * Format: VDL-YYYYMMDD-XXXXXX (e.g. VDL-20241204-A3F2K1)
 * @returns {string}
 */
const generateOrderNumber = () => {
    const date = new Date()
    const datePart = date.toISOString().slice(0, 10).replace(/-/g, '') // YYYYMMDD
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase() // 6 chars
    return `VDL-${datePart}-${randomPart}`
}

/**
 * Check if all items in an order have sufficient stock.
 * @param {Array<{watch: object, qty: number}>} items - items with populated watch docs
 * @returns {{ ok: boolean, failedItem?: string }} 
 */
const checkStock = (items = []) => {
    for (const item of items) {
        if (item.watch.stock < item.qty) {
            return { ok: false, failedItem: item.watch.name }
        }
    }
    return { ok: true }
}

module.exports = { calculateOrderTotal, generateOrderNumber, checkStock }
