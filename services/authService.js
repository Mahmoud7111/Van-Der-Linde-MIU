// register/login logic, JWT generation, password reset flow
// register/login logic, JWT generation, password reset flow
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const PasswordToken = require('../models/PasswordToken')
const { signToken } = require('../utils/jwt')
const { hashToken } = require('../utils/securityUtils')
const { assertLength, isEmail, normalizeEmail, cleanString } = require('../utils/validationUtils')
const { sendEmail } = require('../utils/emailService')
const { FRONTEND_URL } = require('../config/env')

// ─── helpers ────────────────────────────────────────────────────────────────

const makeError = (msg, code) => {
    const err = new Error(msg)
    err.statusCode = code
    return err
}

const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

// ─── register ───────────────────────────────────────────────────────────────

const register = async (name, email, password) => {
    const cleanName = assertLength(name, 'Name', 2, 80)
    const cleanEmail = normalizeEmail(email)
    const cleanPassword = cleanString(password)

    if (!isEmail(cleanEmail)) throw makeError('Please enter a valid email', 400)
    if (cleanPassword.length < 6) throw makeError('Password must be at least 6 characters', 400)

    const existing = await User.findOne({ email: cleanEmail })
    if (existing) throw makeError('Email already in use', 400)

    // Password is stored as-is here; the User pre-save hook hashes it with bcrypt (saltRounds 12)
    const user = await User.create({ name: cleanName, email: cleanEmail, password: cleanPassword })

    const token = signToken(user._id)

    // Re-fetch without password field so we never return it
    const safeUser = await User.findById(user._id).select('-password')
    return { user: safeUser, token }
}

// ─── login ──────────────────────────────────────────────────────────────────

const login = async (email, password) => {
    const cleanEmail = normalizeEmail(email)
    if (!isEmail(cleanEmail) || !password) throw makeError('Invalid credentials', 401)

    // Explicitly select password — it is select:false in the schema
    const user = await User.findOne({ email: cleanEmail }).select('+password')
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
    const cleanEmail = normalizeEmail(email)
    if (!isEmail(cleanEmail)) throw makeError('Please enter a valid email', 400)

    const user = await User.findOne({ email: cleanEmail })
    if (!user) throw makeError('No account found with that email', 404)

    // Generate a cryptographically secure raw token
    const rawToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = hashToken(rawToken)
    const resetUrl = `${FRONTEND_URL.replace(/\/$/, '')}/reset-password?token=${rawToken}`

    await PasswordToken.create({
        user:      user._id,
        token:     hashedToken,
        expiresAt: Date.now() + 3600000, // 1 hour
        isUsed:    false,
    })

    await sendEmail({
        to: cleanEmail,
        subject: 'Reset your Van Der Linde password',
        text: `Reset your password using this link: ${resetUrl}. This link expires in 1 hour.`,
        html: `
            <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2933;">
                <h2 style="color:#111827;">Reset Your Password</h2>
                <p>Dear ${escapeHtml(cleanString(user.name) || 'Van Der Linde customer')},</p>
                <p>We received a request to reset your password. Use the button below to create a new password.</p>
                <p>
                    <a href="${resetUrl}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:4px;">
                        Reset Password
                    </a>
                </p>
                <p>If the button does not work, copy this link into your browser:</p>
                <p style="word-break:break-all;color:#8a6a2f;">${resetUrl}</p>
                <p>This link expires in 1 hour. If you did not request this, you can ignore this email.</p>
                <p style="margin-top:24px;color:#8a6a2f;"><em>Van Der Linde - Crafting Legacy Since 1874</em></p>
            </div>
        `,
    })

    return { sent: true }
}

// ─── resetPassword ──────────────────────────────────────────────────────────

const resetPassword = async (rawToken, newPassword) => {
    if (cleanString(newPassword).length < 6) throw makeError('Password must be at least 6 characters', 400)

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
