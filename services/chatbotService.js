// Chatbot logic: backend-only rule and catalog assistant, no external AI calls.
const Watch = require('../models/Watch')
require('../models/Brand') // Required for population

const normalise = (value = '') => String(value).toLowerCase()

const includesAny = (text, words) => words.some((word) => text.includes(word))

const formatPrice = (value) => {
    const amount = Number(value)
    if (!Number.isFinite(amount)) return 'Price available on request'
    return `$${amount.toLocaleString('en-US')}`
}

const getWatchBrand = (watch) => watch.brand?.name || 'Van Der Linde'

const findRelevantWatches = (message, watches = []) => {
    const text = normalise(message)
    const categoryHints = ['sport', 'classic', 'luxury', 'smart', 'dress', 'dive', 'pilot', 'casual']
    const matchedCategory = categoryHints.find((category) => text.includes(category))

    const directMatches = watches.filter((watch) => {
        const haystack = normalise(`${getWatchBrand(watch)} ${watch.name} ${watch.category}`)
        return text
            .split(/\s+/)
            .some((word) => word.length > 3 && haystack.includes(word))
    })

    if (directMatches.length) return directMatches
    if (matchedCategory) return watches.filter((watch) => watch.category === matchedCategory)

    if (includesAny(text, ['cheap', 'affordable', 'budget', 'lowest price'])) {
        return [...watches].sort((a, b) => Number(a.price) - Number(b.price)).slice(0, 5)
    }

    if (includesAny(text, ['best', 'recommend', 'suggest', 'top rated'])) {
        return [...watches].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0)).slice(0, 5)
    }

    return []
}

const buildCatalogReply = (message, watches = []) => {
    const relevant = findRelevantWatches(message, watches)
        .filter((watch) => watch.isActive !== false)
        .slice(0, 3)

    if (!relevant.length) return null

    const list = relevant
        .map((watch) => {
            const stock = watch.stock > 0 ? 'in stock' : 'currently unavailable'
            return `${getWatchBrand(watch)} ${watch.name} - ${formatPrice(watch.price)} (${stock})`
        })
        .join('\n')

    return `Here are some matches from our catalog:\n${list}\n\nOpen the Shop page for full details, or use the Configurator if you want a custom request.`
}

const buildStaticReply = (message) => {
    const text = normalise(message)

    if (includesAny(text, ['hello', 'hi', 'hey', 'good morning', 'good evening'])) {
        return 'Hello! I am the Van Der Linde Assistant. I can help you find watches, explore collections, use the configurator, or understand checkout and gifting.'
    }

    if (includesAny(text, ['thank you', 'thanks', 'bye', 'goodbye', 'that is all', "that's all"])) {
        return 'It was a pleasure assisting you. If you need anything else, feel free to ask.'
    }

    if (includesAny(text, ['warranty', 'guarantee'])) {
        return 'All Van Der Linde timepieces carry a 5-year international warranty covering manufacturing defects.'
    }

    if (includesAny(text, ['authentic', 'original', 'genuine', 'fake', 'real'])) {
        return 'Every watch in our catalog is authentic and connected to a real brand record in our system.'
    }

    if (includesAny(text, ['shipping cost', 'delivery cost', 'shipping price', 'delivery fee'])) {
        return 'Shipping rates are simple: standard delivery is $20 and express delivery is $40.'
    }

    if (includesAny(text, ['deliver', 'shipping', 'arrive', 'how long'])) {
        return 'Standard delivery takes around 5 business days. Express delivery takes around 2 business days.'
    }

    if (includesAny(text, ['config', 'custom', 'personalize', 'personalise'])) {
        return 'Use the Configurator page to choose the model, case, bezel, dial, and strap. After submitting the form, the customer receives a confirmation email and the admin receives the request details.'
    }

    if (text.includes('gift')) {
        return 'Use the Gifting page to choose a watch and wrapping options. Gift details are saved with the cart item and then copied into the checkout order.'
    }

    if (includesAny(text, ['checkout', 'payment', 'pay', 'cart', 'order'])) {
        return 'Checkout has three steps: shipping, payment, and review. The backend validates the order, saves it in MongoDB, and connects it to the logged-in user.'
    }

    if (includesAny(text, ['wishlist', 'favorite', 'favourite'])) {
        return 'Wishlist items are stored in MongoDB for the logged-in user, so they stay available across devices after the frontend and backend are deployed together.'
    }

    if (includesAny(text, ['contact', 'support', 'help', 'reach', 'email', 'phone'])) {
        return 'You can reach the concierge team from the Contact page. Configuration requests also send email notifications to the customer and admin.'
    }

    if (includesAny(text, ['hour', 'open', 'schedule'])) {
        return 'Our concierge is available Monday to Friday from 9:00 AM to 6:00 PM, Saturday from 10:00 AM to 4:00 PM, and Sunday is closed.'
    }

    if (includesAny(text, ['brand', 'brands'])) {
        return 'Brands organize watches by maker, such as Rolex, Omega, Cartier, and Patek Philippe. The backend exposes them through GET /api/brands for shop filters and admin product forms.'
    }

    if (includesAny(text, ['collection', 'collections'])) {
        return 'Collections group watches into curated families. The backend exposes GET /api/collections and GET /api/collections/:slug for collection pages and filters.'
    }

    if (includesAny(text, ['review', 'rating'])) {
        return 'Reviews let logged-in users rate watches from 1 to 5 and write feedback. The backend stores reviews and recalculates the watch rating.'
    }

    if (includesAny(text, ['login', 'register', 'account', 'profile'])) {
        return 'Account features use authentication cookies. Users can register, log in, edit profile details, view orders, and keep cart or wishlist data connected to their account.'
    }

    return null
}

const handleMessage = async (message) => {
    const cleanMessage = String(message || '').trim()
    if (!cleanMessage) return 'Please type a question and I will help you.'

    const staticReply = buildStaticReply(cleanMessage)
    if (staticReply) return staticReply

    const watches = await Watch.find({ isActive: { $ne: false } })
        .populate('brand', 'name')
        .select('name price category brand rating stock isActive')
        .sort({ rating: -1, price: 1 })
        .limit(40)

    const catalogReply = buildCatalogReply(cleanMessage, watches)
    if (catalogReply) return catalogReply

    return 'I can assist with watches, brands, collections, configurator requests, gifting, wishlist, cart, checkout, reviews, and account support. Try asking about a style, budget, or specific model.'
}

module.exports = { handleMessage }
