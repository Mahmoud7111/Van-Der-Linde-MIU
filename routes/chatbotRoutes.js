const router = require('express').Router()
const { chatbotLimiter } = require('../middleware/rateLimiter')
const { sendMessage } = require('../controllers/chatbotController')

// POST /api/chatbot/message — public, rate-limited
router.post('/message', chatbotLimiter, sendMessage)

module.exports = router
