// mounts all route groups at /api
const router = require('express').Router()

router.use('/auth',         require('./authRoutes'))
router.use('/watches',                    require('./watchRoutes'))
router.use('/watches/:watchId/reviews',   require('./reviewRoutes'))
router.use('/reviews',      require('./adminReviewRoutes'))
router.use('/orders',       require('./orderRoutes'))
router.use('/cart',         require('./cartRoutes'))
router.use('/wishlist',     require('./wishlistRoutes'))
router.use('/users',        require('./userRoutes'))
router.use('/collections',  require('./collectionRoutes'))
router.use('/brands',       require('./brandRoutes'))
router.use('/configurator', require('./configuratorRoutes'))
router.use('/chatbot',      require('./chatbotRoutes'))
router.use('/admin',        require('./adminRoutes'))
router.use('/shipping',     require('./shippingRoutes'))

module.exports = router
