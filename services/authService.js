// register/login logic, JWT generation, password reset flow
// register/login logic, JWT generation, password reset flow
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const PasswordToken = require('../models/PasswordToken')
const { signToken } = require('../utils/jwt')
const { hashToken } = require('../utils/securityUtils')

// ─── helpers ────────────────────────────────────────────────────────────────

const makeError = (msg, code) => {
    const err = new Error(msg)
    err.statusCode = code
    return err
}

// ─── register ───────────────────────────────────────────────────────────────

const register = async (name, email, password) => {
    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) throw makeError('Email already in use', 400)

    // Password is stored as-is here; the User pre-save hook hashes it with bcrypt (saltRounds 12)
    const user = await User.create({ name, email, password })

    const token = signToken(user._id)

    // Re-fetch without password field so we never return it
    const safeUser = await User.findById(user._id).select('-password')
    return { user: safeUser, token }
}

// ─── login ──────────────────────────────────────────────────────────────────

const login = async (email, password) => {
    // Explicitly select password — it is select:false in the schema
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user) throw makeError('Invalid credentials', 401)

    // Use the model's comparePassword method (bcrypt.compare internally)
    const match = await user.comparePassword(password)
    if (!match) throw makeError('Invalid credentials', 401)

    const token = signToken(user._id)

    // Strip password before returning
    user.password = undefined
    return { user, token }
}

// ─── getMe ──────────────────────────────────────────────────────────────────

const getMe = async (userId) => {
    const user = await User.findById(userId).select('-password')
    if (!user) throw makeError('User not found', 404)
    return user
}

// ─── logout ─────────────────────────────────────────────────────────────────
// Nothing to do in the service — cookie is cleared in the controller

const logout = async () => {}

// ─── forgotPassword ─────────────────────────────────────────────────────────

const forgotPassword = async (email) => {
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) throw makeError('No account found with that email', 404)

    // Generate a cryptographically secure raw token
    const rawToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = hashToken(rawToken)

    await PasswordToken.create({
        user:      user._id,
        token:     hashedToken,
        expiresAt: Date.now() + 3600000, // 1 hour
        isUsed:    false,
    })

    // Email sending is deferred — return raw token for now
    return { token: rawToken }
}

// ─── resetPassword ──────────────────────────────────────────────────────────

const resetPassword = async (rawToken, newPassword) => {
    const hashedToken = hashToken(rawToken)

    const record = await PasswordToken.findOne({
        token:     hashedToken,
        isUsed:    false,
        expiresAt: { $gt: Date.now() },
    })
    if (!record) throw makeError('Token is invalid or has expired', 400)

    const user = await User.findById(record.user)
    if (!user) throw makeError('User not found', 404)

    // Set new plain password — pre-save hook will hash it
    user.password = newPassword
    await user.save()

    record.isUsed = true
    await record.save()

    return { success: true }
}

// ─── exports ─────────────────────────────────────────────────────────────────

module.exports = { register, login, getMe, logout, forgotPassword, resetPassword }