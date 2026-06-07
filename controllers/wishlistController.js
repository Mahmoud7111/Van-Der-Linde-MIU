//! Client-side wishlist only
//! In the future: Server-side wishlist

// getWishlist, addWatch, removeWatch
const wishlistService = require('../services/wishlistService')

// GET /api/wishlist
const getWishlist = async (req, res, next) => {
    try {
        const wishlist = await wishlistService.getWishlist(req.user._id)
        res.status(200).json({ success: true, message: 'OK', data: wishlist })
    } catch (err) {
        next(err)
    }
}

// POST /api/wishlist — body: { watchId }
const addWatch = async (req, res, next) => {
    try {
        const wishlist = await wishlistService.addWatch(req.user._id, req.body.watchId)
        res.status(200).json({ success: true, message: 'Added to wishlist', data: wishlist })
    } catch (err) {
        next(err)
    }
}

// DELETE /api/wishlist/:watchId
const removeWatch = async (req, res, next) => {
    try {
        const wishlist = await wishlistService.removeWatch(req.user._id, req.params.watchId)
        res.status(200).json({ success: true, message: 'Removed from wishlist', data: wishlist })
    } catch (err) {
        next(err)
    }
}

module.exports = { getWishlist, addWatch, removeWatch }

