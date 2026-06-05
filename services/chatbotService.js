// chatbot logic: process user intent, return AI response via Gemini
const { GoogleGenerativeAI } = require('@google/generative-ai')
const { GEMINI_API_KEY } = require('../config/env')
const Watch = require('../models/Watch')
require('../models/Brand') // Required for population

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

const handleMessage = async (message, pageUrl = '', history = []) => {
    // Fetch live inventory from DB
    const watches = await Watch.find()
        .populate('brand', 'name')
        .select('name price category brand rating stock')

    const productInfo = watches.map(w => {
        const brand = w.brand?.name || 'Van Der Linde'
        const availability = w.stock > 0 ? `In stock (${w.stock})` : 'Currently unavailable'
        return `- ${brand} ${w.name} | Category: ${w.category} | Price: $${w.price} | Rating: ${w.rating}/5 | ${availability}`
    }).join('\n')

    const fullPrompt = `You are the Van Der Linde Assistant, an AI for the Van Der Linde luxury watch brand.

Rules:
- Only answer questions about Van Der Linde watches, collections, and the brand.
- Keep answers concise and refined — this is a luxury brand.
- Use emojis occasionally but sparingly.
- Never invent prices. Only use prices from the product list provided.
- If a watch is out of stock, say it is currently unavailable.
- If asked about something outside your scope, politely redirect to watches.

Brand context:
- Tagline: "Crafting Legacy Since 1874"
- Swiss-inspired luxury watches
- Categories: sport, classic, luxury, smart

Website pages: Home, Shop, Shop Men, Shop Women, Watch Detail, Configurator (custom watch builder), Collections, Quiz, Gifting, Cart, Checkout, Account

The user is currently visiting: ${pageUrl}

Recommendation guidelines:
- Sporty and active lifestyle → recommend sport category
- Timeless and formal occasions → recommend classic category
- Maximum prestige → recommend luxury category
- Tech-forward → recommend smart category

Current inventory:
${productInfo}

User question:
${message}`

    let responseText

    try {
        if (history.length > 0) {
            const chat = model.startChat({ history })
            const result = await chat.sendMessage(fullPrompt)
            responseText = result.response.text()
        } else {
            const result = await model.generateContent([fullPrompt])
            responseText = result.response.text()
        }
    } catch (error) {
        if (error.status === 429) {
            const err = new Error('The AI assistant is currently overwhelmed by too many requests. Please try again later or check the API key quota.')
            err.statusCode = 429
            throw err
        }
        throw error
    }

    // Strip all asterisks from response
    return responseText.replace(/\*/g, '')
}

module.exports = { handleMessage }
