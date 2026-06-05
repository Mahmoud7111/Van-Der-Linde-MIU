// sendMessage — calls Gemini via chatbotService
const chatbotService = require('../services/chatbotService')

const sendMessage = async (req, res, next) => {
    const { message, pageUrl, history = [] } = req.body

    if (!message)
        return res.status(400).json({ success: false, message: 'Message is required', data: null })

    try {
        const reply = await chatbotService.handleMessage(message, pageUrl, history)
        res.status(200).json({ success: true, message: 'OK', data: { reply } })
    } catch (err) {
        next(err)
    }
}

module.exports = { sendMessage }
