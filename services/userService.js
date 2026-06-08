// profile CRUD, Cloudinary upload flow
// profile CRUD, profile picture upload
const User = require('../models/User')
const { assertLength, cleanString, isEmail, isPhone, normalizeEmail } = require('../utils/validationUtils')

// ─── helpers ────────────────────────────────────────────────────────────────

const makeError = (msg, code) => {
    const err = new Error(msg)
    err.statusCode = code
    return err
}

// ─── getProfile ──────────────────────────────────────────────────────────────

const getProfile = async (userId) => {
    const user = await User.findById(userId).select('-password')
    if (!user) throw makeError('User not found', 404)
    return user
}

// ─── updateProfile ───────────────────────────────────────────────────────────

const updateProfile = async (userId, data) => {
    // Whitelist — prevent mass-assignment of role, password, etc.
    const allowed = ['name', 'email', 'phone', 'address']
    const update = Object.fromEntries(
        Object.entries(data).filter(([k]) => allowed.includes(k))
    )

    if (Object.prototype.hasOwnProperty.call(update, 'name')) {
        update.name = assertLength(update.name, 'Name', 2, 80)
    }

    if (update.email) {
        update.email = normalizeEmail(update.email)
        if (!isEmail(update.email)) throw makeError('Please enter a valid email', 400)
        const existing = await User.findOne({ email: update.email, _id: { $ne: userId } })
        if (existing) throw makeError('Email already in use', 400)
    }

    if (Object.prototype.hasOwnProperty.call(update, 'phone')) {
        update.phone = cleanString(update.phone)
        if (update.phone && !isPhone(update.phone)) throw makeError('Please enter a valid phone number', 400)
    }

    const user = await User.findByIdAndUpdate(userId, update, { new: true }).select('-password')
    if (!user) throw makeError('User not found', 404)
    return user
}

// ─── uploadProfilePicture ─────────────────────────────────────────────────────

const uploadProfilePicture = async (userId, filePath) => {
    // Normalise Windows backslashes → forward slashes for URL storage
    const normalised = filePath.replace(/\\/g, '/')
    const user = await User.findByIdAndUpdate(
        userId,
        { profilePicture: normalised },
        { new: true }
    ).select('-password')
    if (!user) throw makeError('User not found', 404)
    return user
}

// ─── getAllUsers (admin) ──────────────────────────────────────────────────────

const getAllUsers = async () => {
    return User.find().select('-password').sort({ createdAt: -1 })
}

// ─── deleteUser (admin) ───────────────────────────────────────────────────────

const deleteUser = async (userId, requestingUserId) => {
    if (userId === requestingUserId.toString()) {
        throw makeError('Cannot delete your own admin account', 400)
    }
    const user = await User.findByIdAndDelete(userId)
    if (!user) throw makeError('User not found', 404)
    return user
}

// ─── exports ─────────────────────────────────────────────────────────────────

module.exports = { getProfile, updateProfile, uploadProfilePicture, getAllUsers, deleteUser }
