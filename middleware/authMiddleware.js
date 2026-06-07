// protect() verifies JWT from cookie or Bearer header + sets req.user; adminOnly() checks role
const { verifyToken } = require('../utils/jwt')
const User = require('../models/User')

const protect = async (req, res, next) => {
    let token = null

    // 1. Cookie-first (set by cookieManager after login/register)
    if (req.cookies?.authToken) {
        token = req.cookies.authToken
    }
    // 2. Fall back to Authorization: Bearer <token> header (mobile / API clients)
    else if (req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized', data: null })
    }

    try {
        const decoded = verifyToken(token)
        req.user = await User.findById(decoded.id).select('-password')

        if (!req.user) {
            return res.status(401).json({ success: false, message: 'User not found', data: null })
        }

        next()
    } catch {
        res.status(401).json({ success: false, message: 'Token invalid or expired', data: null })
    }
}

const adminOnly = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required', data: null })
    }
    next()
}

module.exports = { protect, adminOnly }