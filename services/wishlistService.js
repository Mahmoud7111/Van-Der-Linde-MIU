//! Client-side wishlist only
//! In the future: Server-side wishlist
// getWishlist, addWatch, removeWatch
const Wishlist = require('../models/Wishlist')

// ─── helpers ────────────────────────────────────────────────────────────────

const POPULATE_WATCHES = { path: 'watches', select: 'name images price rating category' }

// ─── getWishlist ─────────────────────────────────────────────────────────────

const getWishlist = async (userId) => {
    const wishlist = await Wishlist.findOne({ user: userId }).populate(POPULATE_WATCHES)
    return wishlist || { watches: [] }
}

// ─── addWatch ─────────────────────────────────────────────────────────────────

const addWatch = async (userId, watchId) => {
    let wishlist = await Wishlist.findOne({ user: userId })
    if (!wishlist) {
        wishlist = new Wishlist({ user: userId, watches: [] })
    }

    // Prevent duplicates — skip silently if already present
    const alreadyIn = wishlist.watches.some((id) => id.toString() === watchId)
    if (!alreadyIn) {
        wishlist.watches.push(watchId)
        await wishlist.save()
    }

    return Wishlist.findById(wishlist._id).populate(POPULATE_WATCHES)
}

// ─── removeWatch ──────────────────────────────────────────────────────────────

const removeWatch = async (userId, watchId) => {
    const wishlist = await Wishlist.findOne({ user: userId })
    if (!wishlist) return { watches: [] }

    wishlist.watches = wishlist.watches.filter((id) => id.toString() !== watchId)
    await wishlist.save()

    return Wishlist.findById(wishlist._id).populate(POPULATE_WATCHES)
}

// ─── exports ─────────────────────────────────────────────────────────────────

module.exports = { getWishlist, addWatch, removeWatch }
