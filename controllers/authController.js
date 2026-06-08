// register, login, logout, getMe, forgotPassword, resetPassword
const authService = require('../services/authService')
const { setCookie, clearCookie } = require('../utils/cookieManager')

// POST /api/auth/register
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body
        const { user, token } = await authService.register(name, email, password)
        setCookie(res, token)
        res.status(201).json({ success: true, message: 'Registered successfully', data: { user } })
    } catch (err) {
        next(err)
    }
}

// POST /api/auth/login
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const { user, token } = await authService.login(email, password)
        setCookie(res, token)
        res.status(200).json({ success: true, message: 'Logged in successfully', data: { user } })
    } catch (err) {
        next(err)
    }
}

// POST /api/auth/logout
const logout = async (req, res, next) => {
    try {
        await authService.logout()
        clearCookie(res)
        res.status(200).json({ success: true, message: 'Logged out', data: null })
    } catch (err) {
        next(err)
    }
}

// GET /api/auth/me
const getMe = async (req, res, next) => {
    try {
        const user = await authService.getMe(req.user._id)
        res.status(200).json({ success: true, message: 'OK', data: user })
    } catch (err) {
        next(err)
    }
}

// POST /api/auth/forgot-password
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body
        const data = await authService.forgotPassword(email, req.get('origin'))
        res.status(200).json({ success: true, message: 'Password reset email sent', data })
    } catch (err) {
        next(err)
    }
}

// POST /api/auth/reset-password
const resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body
        await authService.resetPassword(token, password)
        res.status(200).json({ success: true, message: 'Password reset successfully', data: null })
    } catch (err) {
        next(err)
    }
}

module.exports = { register, login, logout, getMe, forgotPassword, resetPassword }
