// profile CRUD, Cloudinary upload flow
// profile CRUD, profile picture upload
const User = require('../models/User')

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
    const allowed = ['name', 'address']
    const update = Object.fromEntries(
        Object.entries(data).filter(([k]) => allowed.includes(k))
    )

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

// ─── exports ─────────────────────────────────────────────────────────────────

module.exports = { getProfile, updateProfile, uploadProfilePicture }
