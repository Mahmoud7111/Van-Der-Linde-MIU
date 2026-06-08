// getProfile, updateProfile, uploadProfilePicture, getAllUsers (admin), deleteUser (admin)
const userService = require('../services/userService')

// GET /api/users/profile
const getProfile = async (req, res, next) => {
    try {
        const user = await userService.getProfile(req.user._id)
        res.status(200).json({ success: true, message: 'OK', data: user })
    } catch (err) {
        next(err)
    }
}

// PUT /api/users/profile
const updateProfile = async (req, res, next) => {
    try {
        const user = await userService.updateProfile(req.user._id, req.body)
        res.status(200).json({ success: true, message: 'Profile updated', data: user })
    } catch (err) {
        next(err)
    }
}

// POST /api/users/profile/picture — Multer sets req.file
const uploadProfilePicture = async (req, res, next) => {
    try {
        if (!req.file) {
            const err = new Error('No file uploaded')
            err.statusCode = 400
            return next(err)
        }
        const user = await userService.uploadProfilePicture(req.user._id, req.file.path)
        res.status(200).json({ success: true, message: 'Profile picture updated', data: user })
    } catch (err) {
        next(err)
    }
}

// GET /api/users — admin only
const getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers()
        res.status(200).json({ success: true, message: 'OK', data: users })
    } catch (err) {
        next(err)
    }
}

// DELETE /api/users/:id — admin only
const deleteUser = async (req, res, next) => {
    try {
        await userService.deleteUser(req.params.id, req.user._id)
        res.status(200).json({ success: true, message: 'User deleted', data: null })
    } catch (err) {
        next(err)
    }
}

module.exports = { getProfile, updateProfile, uploadProfilePicture, getAllUsers, deleteUser }
