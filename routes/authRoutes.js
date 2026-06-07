// /auth: login, register, logout, me, forgot-password, reset-password
const router = require('express').Router()
const { register, login, logout, getMe, forgotPassword, resetPassword } = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')
const { authLimiter } = require('../middleware/rateLimiter')

router.post('/register',        authLimiter, register)
router.post('/login',           authLimiter, login)
router.post('/logout',          logout)
router.get('/me',               protect, getMe)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password',  resetPassword)

module.exports = router