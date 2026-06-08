// chatbot logic: Gemini-first with a local catalog fallback when quota is exhausted
const { GoogleGenerativeAI } = require('@google/generative-ai')
const { GEMINI_API_KEY } = require('../config/env')
const Watch = require('../models/Watch')
require('../models/Brand') // Required for population

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null
const model = genAI ? genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }) : null

const normalise = (value = '') => String(value).toLowerCase()

const formatPrice = (value) => {
    const amount = Number(value)
    if (!Number.isFinite(amount)) return 'Price available on request'
    return `$${amount.toLocaleString('en-US')}`
}

const getWatchBrand = (watch) => watch.brand?.name || 'Van Der Linde'

const summarizeWatches = (watches = [], limit = 18) => watches
    .slice(0, limit)
    .map((w) => {
        const availability = w.stock > 0 ? `In stock (${w.stock})` : 'Currently unavailable'
        return `- ${getWatchBrand(w)} ${w.name} | ${w.category} | ${formatPrice(w.price)} | ${availability}`
    })
    .join('\n')

const findRelevantWatches = (message, watches = []) => {
    const text = normalise(message)
    const categoryHints = ['sport', 'classic', 'luxury', 'smart', 'dress', 'dive', 'pilot', 'casual']
    const matchedCategory = categoryHints.find((category) => text.includes(category))

    const directMatches = watches.filter((watch) => {
        const haystack = normalise(`${getWatchBrand(watch)} ${watch.name} ${watch.category}`)
        return text.split(/\s+/).some((word) => word.length > 3 && haystack.includes(word))
    })

    if (directMatches.length) return directMatches
    if (matchedCategory) return watches.filter((watch) => watch.category === matchedCategory)

    if (text.includes('cheap') || text.includes('affordable') || text.includes('budget')) {
        return [...watches].sort((a, b) => Number(a.price) - Number(b.price)).slice(0, 5)
    }

    if (text.includes('best') || text.includes('recommend') || text.includes('suggest')) {
        return [...watches].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0)).slice(0, 5)
    }

    return [] // ← was: return watches — this was making every message show the catalog
}

const buildFallbackReply = (message, watches = []) => {
    const text = normalise(message)

    // Greetings
    if (['hello', 'hi', 'hey', 'good morning', 'good evening'].some(w => text.includes(w))) {
        return 'Hello! I am the Van Der Linde Assistant. I can help you find a watch, explore collections, use the configurator, or assist with checkout and gifting.'
    }

    // Farewell
    if (['thank you', 'thanks', 'bye', 'goodbye', 'that\'s all'].some(w => text.includes(w))) {
        return 'It was a pleasure assisting you. If you need anything else, feel free to ask. Have a wonderful day.'
    }

    // Warranty
    if (text.includes('warrant') || text.includes('guarantee')) {
        return 'All Van Der Linde timepieces carry a 5-year international warranty covering manufacturing defects.'
    }

    // Authenticity
    if (['authentic', 'original', 'genuine', 'fake', 'real'].some(w => text.includes(w))) {
        return 'Every watch we offer is 100% authentic. We are an authorised dealer for all brands in our catalog.'
    }

    // Delivery time
    if (['deliver', 'shipping', 'how long', 'arrive', 'days'].some(w => text.includes(w)) && !text.includes('cost') && !text.includes('price') && !text.includes('fee')) {
        return 'We offer two options:\n1. Standard delivery — 5 business days.\n2. Express delivery — 2 business days.'
    }

    // Delivery cost
    if (['shipping cost', 'delivery cost', 'shipping price', 'delivery fee', 'how much'].some(w => text.includes(w))) {
        return 'Shipping rates:\n1. Standard delivery — $20.\n2. Express delivery — $40.'
    }

    // Configurator
    if (text.includes('config') || text.includes('custom') || text.includes('personaliz')) {
        return 'Use the Configurator page to choose your model, case, bezel, dial, and strap. Submit the form and our team will contact you with a confirmation.'
    }

    // Gifting
    if (text.includes('gift')) {
        return 'Visit the Gifting page to select a watch and wrapping options. Gift details are saved with your order at checkout.'
    }

    // Checkout / payment
    if (['checkout', 'payment', 'pay', 'cart', 'order'].some(w => text.includes(w))) {
        return 'Checkout has three steps: shipping, payment, and review. You can pay by card or choose cash on delivery. Your order is saved to your account history.'
    }

    // Support / contact
    if (['contact', 'support', 'help', 'reach', 'email', 'phone'].some(w => text.includes(w))) {
        return 'You can reach our concierge team from the Contact page. For configuration requests, the form sends a confirmation to both you and our admin.'
    }

    // Working hours
    if (text.includes('hour') || text.includes('open') || text.includes('schedule')) {
        return 'Our concierge is available:\nMonday – Friday: 9:00 AM – 6:00 PM\nSaturday: 10:00 AM – 4:00 PM\nSunday: Closed'
    }

    // Product / catalog inquiry
    const relevant = findRelevantWatches(message, watches)
        .filter(w => w.isActive !== false)
        .slice(0, 3)

    if (relevant.length) {
        const list = relevant
            .map(w => `${getWatchBrand(w)} ${w.name} — ${formatPrice(w.price)} (${w.stock > 0 ? 'in stock' : 'currently unavailable'})`)
            .join('\n')
        return `Here are some matches from our catalog:\n${list}\n\nVisit the Shop page for full details or use the Configurator for a custom request.`
    }

    // Default
    return 'I can assist with watches, collections, the configurator, gifting, cart, checkout, and account support. Try asking about a style, budget, or specific model.'
}

const buildPrompt = ({ message, pageUrl, watches }) => `You are the Van Der Linde Assistant for a luxury watch website.

Rules:
- Only answer questions about Van Der Linde watches, collections, configurator, gifting, cart, checkout, account, and support.
- Keep answers concise and refined.
- Never invent prices. Use only the product list.
- If a watch is out of stock, say it is currently unavailable.
- If asked outside scope, politely redirect to watches.

Brand context:
- Tagline: "Crafting Legacy Since 1874"
- Categories: sport, classic, luxury, smart, dress, dive, pilot, casual
- Current page: ${pageUrl || 'unknown'}

Current catalog sample:
${summarizeWatches(watches)}

User question:
${message}`

const handleMessage = async (message, pageUrl = '') => {
    const cleanMessage = String(message || '').trim()
    if (!cleanMessage) return 'Please type a question and I will help you.'

    const watches = await Watch.find({ isActive: { $ne: false } })
        .populate('brand', 'name')
        .select('name price category brand rating stock isActive')
        .sort({ rating: -1, price: 1 })
        .limit(30)

    if (!model) {
        return buildFallbackReply(cleanMessage, watches)
    }

    try {
        const result = await model.generateContent([buildPrompt({ message: cleanMessage, pageUrl, watches })])
        const responseText = result.response.text()
        return responseText.replace(/\*/g, '').trim() || buildFallbackReply(cleanMessage, watches)
    } catch (error) {
        console.error('Gemini chatbot fallback:', {
            status: error.status,
            message: error.message,
        })

        return buildFallbackReply(cleanMessage, watches)
    }
}

module.exports = { handleMessage }
