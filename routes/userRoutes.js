// const router = require('express').Router()

// // /users: profile GET/PUT, profile picture POST

// module.exports = router

const router = require('express').Router()
const { getProfile, updateProfile, uploadProfilePicture } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
const upload = require('../middleware/upload')

// /users: profile GET/PUT, profile picture POST
router.get('/profile',         protect,                               getProfile)
router.put('/profile',         protect,                               updateProfile)
router.post('/profile/picture',protect, upload.single('picture'),     uploadProfilePicture)

module.exports = router