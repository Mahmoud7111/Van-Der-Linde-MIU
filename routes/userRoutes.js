const router = require('express').Router()
const { getProfile, updateProfile, uploadProfilePicture, getAllUsers, deleteUser } = require('../controllers/userController')
const { protect, adminOnly } = require('../middleware/authMiddleware')
const upload = require('../middleware/upload')

// /users: profile GET/PUT, profile picture POST
router.get('/profile',         protect,                               getProfile)
router.put('/profile',         protect,                               updateProfile)
router.post('/profile/picture',protect, upload.single('picture'),     uploadProfilePicture)

// Admin-only routes
router.get('/',                protect, adminOnly,                    getAllUsers)
router.delete('/:id',          protect, adminOnly,                    deleteUser)

module.exports = router