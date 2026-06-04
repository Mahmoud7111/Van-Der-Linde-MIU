// protect() verifies JWT + sets req.user; adminOnly() checks role

const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('./config/env')
const User = require('./models/User')
const { error } = require('./utils/apiResponse')

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) return error(res, 'Not authorized', 401)
    try {
        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = await User.findById(decoded.id).select('-password')
        if (!req.user) 
            return error(res, 'User not found', 401)
        next()
    } catch {
        error(res, 'Token invalid or expired', 401)
    }
}

const adminOnly = (req, res, next) => {
    if (req.user?.role !== 'admin') return error(res, 'Admin access required', 403)
    next()
}

module.exports = { protect, adminOnly }