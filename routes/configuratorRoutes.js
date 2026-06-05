const router = require('express').Router()
const { protect, adminOnly } = require('../middleware/authMiddleware')
const { submitConfig, getRequests } = require('../controllers/configuratorController')

// POST /api/configurator/submit — public (userId attached if logged in via optional auth)
router.post('/submit', submitConfig)

// GET /api/configurator/requests — admin only
router.get('/requests', protect, adminOnly, getRequests)

module.exports = router
