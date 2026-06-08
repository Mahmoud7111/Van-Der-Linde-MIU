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
        return [...watches].sort((a, b) => Number(a.price) - Number(b.price))
    }

    if (text.includes('best') || text.includes('recommend') || text.includes('suggest')) {
        return [...watches].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
    }

    return watches
}

const buildFallbackReply = (message, watches = []) => {
    const text = normalise(message)
    const relevant = findRelevantWatches(message, watches)
        .filter((watch) => watch.isActive !== false)
        .slice(0, 3)

    if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
        return 'Hello, I am the Van Der Linde Assistant. I can help you choose a watch, compare categories, use the configurator, or explain checkout and gifting.'
    }

    if (text.includes('config') || text.includes('custom')) {
        return 'You can use the Configurator page to choose the model, case, bezel, dial, and strap, then submit the request form. Our team receives the configuration and you receive a confirmation email.'
    }

    if (text.includes('gift')) {
        return 'For gifts, open the Gifting page, choose the watch and wrapping options, then add it to cart. The gift details are saved with the cart and checkout order.'
    }

    if (text.includes('checkout') || text.includes('payment') || text.includes('cart')) {
        return 'Checkout has three steps: shipping, payment, and review. You can pay by card or cash on delivery, then the order is saved to your account history.'
    }

    if (text.includes('contact') || text.includes('support')) {
        return 'You can reach the concierge team from the Contact page. For configuration requests, the form also sends a confirmation email to you and a notification to the admin.'
    }

    if (relevant.length) {
        const recommendations = relevant
            .map((watch) => `${getWatchBrand(watch)} ${watch.name} - ${formatPrice(watch.price)} (${watch.stock > 0 ? 'in stock' : 'currently unavailable'})`)
            .join('\n')

        return `Here are good matches from our catalog:\n${recommendations}\n\nYou can open the Shop page to view details or use the Configurator for a custom request.`
    }

    return 'I can help with Van Der Linde watches, collections, configurator requests, gifting, cart, checkout, and account support. Ask me what style or budget you prefer and I will guide you.'
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
