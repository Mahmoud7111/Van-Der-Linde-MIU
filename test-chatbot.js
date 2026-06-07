require('dotenv').config()
const { handleMessage } = require('./services/chatbotService')
const mongoose = require('mongoose')

async function test() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Connected to DB')
        const response = await handleMessage('Hello', '/home', [])
        console.log('Response:', response)
    } catch (err) {
        console.error('Error:', err)
    } finally {
        await mongoose.disconnect()
    }
}

test()
