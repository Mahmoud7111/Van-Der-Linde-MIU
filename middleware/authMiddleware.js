// protect() verifies JWT + sets req.user; adminOnly() checks role

const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/env')
const User = require('../models/User')

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader?.startsWith('Bearer '))
        return res.status(401).json({ success: false, message: 'Not authorized', data: null })
    
    try {
        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = await User.findById(decoded.id).select('-password')

        if (!req.user)
            return res.status(401).json({ success: false, message: 'User not found', data: null })

        next()
    } 
    catch {
        res.status(401).json({ success: false, message: 'Token invalid or expired', data: null })
    }
}

const adminOnly = (req, res, next) => {
    if (req.user?.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin access required', data: null })
    next()
}

module.exports = { protect, adminOnly }