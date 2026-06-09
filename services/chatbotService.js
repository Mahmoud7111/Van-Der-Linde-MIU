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

const extractBudget = (text) => {
    const match = text.match(/(?:under|below|less than|max|maximum|budget|up to)\s*\$?\s*(\d{3,7})/)
    return match ? Number(match[1]) : null
}

const findRelevantWatches = (message, watches = []) => {
    const text = normalise(message)
    const categoryHints = ['sport', 'classic', 'luxury', 'smart', 'dress', 'dive', 'pilot', 'casual']
    const matchedCategory = categoryHints.find((category) => text.includes(category))
    const budget = extractBudget(text)
    const gender = text.includes('women') || text.includes('female') || text.includes('ladies')
        ? 'women'
        : text.includes('men') || text.includes('male') || text.includes('gentlemen')
            ? 'men'
            : null

    const directMatches = watches.filter((watch) => {
        const haystack = normalise(`${getWatchBrand(watch)} ${watch.name} ${watch.category}`)
        return text
            .split(/\s+/)
            .some((word) => word.length > 3 && haystack.includes(word))
    })

    let matches = directMatches.length ? directMatches : watches

    if (matchedCategory) matches = matches.filter((watch) => watch.category === matchedCategory)
    if (gender) matches = matches.filter((watch) => watch.gender === gender || watch.gender === 'unisex')
    if (budget) matches = matches.filter((watch) => Number(watch.price) <= budget)

    if (matches.length !== watches.length) {
        return matches.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
    }

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

    if (includesAny(text, ['return', 'refund', 'exchange'])) {
        return 'Returns and exchanges are handled through customer support. Keep the watch unused with its box and documents, then contact the concierge team from the Contact page for the next step.'
    }

    if (includesAny(text, ['size', 'sizing', 'fit', 'wrist', 'diameter'])) {
        return 'For sizing, check the case diameter in the watch specifications. Smaller wrists usually suit 36-39mm, while 40-44mm gives a stronger wrist presence.'
    }

    if (includesAny(text, ['compare', 'comparison', 'difference between', 'versus', ' vs '])) {
        return 'You can compare watches by brand, category, price, rating, stock, and specifications such as movement, case material, water resistance, and bracelet type.'
    }

    if (includesAny(text, ['new arrival', 'new arrivals', 'latest', 'recent'])) {
        return 'The Shop page can show the newest watches first. The backend sorts catalog results by creation date unless another sort option is selected.'
    }

    if (includesAny(text, ['featured', 'popular', 'homepage', 'home page'])) {
        return 'Featured watches are marked in the catalog with an isFeatured flag. The frontend can use them for home page highlights and favorites sections.'
    }

    if (includesAny(text, ['cancel order', 'cancel my order', 'cancellation'])) {
        return 'If the order is still pending or processing, contact support quickly with your order number. Once it is shipped, cancellation may not be available and support will guide you through return options.'
    }

    if (includesAny(text, ['track', 'tracking', 'order status', 'where is my order'])) {
        return 'Logged-in users can view their order history from the Account page. Admins can also update order status from the admin order management screen.'
    }

    if (includesAny(text, ['authentic', 'original', 'genuine', 'fake', 'real'])) {
        return 'Every watch in our catalog is authentic and connected to a real brand record in our system.'
    }

    if (includesAny(text, ['certificate', 'papers', 'documents', 'box'])) {
        return 'Each luxury watch should be kept with its box and documents. These help with authenticity, warranty support, and future resale value.'
    }

    if (includesAny(text, ['discount', 'coupon', 'promo', 'promotion', 'sale'])) {
        return 'Discounts and promotions depend on the current store policy. Check the checkout page or contact support if you have a specific coupon code.'
    }

    if (includesAny(text, ['tax', 'taxes', 'vat'])) {
        return 'Taxes are shown during checkout when applicable. The order review step shows the subtotal, shipping, estimated tax, and final total before placing the order.'
    }

    if (includesAny(text, ['shipping cost', 'delivery cost', 'shipping price', 'delivery fee'])) {
        return 'Shipping rates are simple: standard delivery is $20 and express delivery is $40.'
    }

    if (includesAny(text, ['international', 'outside country', 'worldwide', 'ship abroad'])) {
        return 'International delivery depends on the destination and support availability. Contact the concierge team with your country before placing a high-value order.'
    }

    if (includesAny(text, ['address', 'change address', 'wrong address'])) {
        return 'If you entered the wrong shipping address, contact support as soon as possible. If the order has not shipped yet, the team may be able to update it.'
    }

    if (includesAny(text, ['deliver', 'shipping', 'arrive', 'how long'])) {
        return 'Standard delivery takes around 5 business days. Express delivery takes around 2 business days.'
    }

    if (includesAny(text, ['config', 'custom', 'personalize', 'personalise'])) {
        return 'Use the Configurator page to choose the model, case, bezel, dial, and strap. After submitting the form, the customer receives a confirmation email and the admin receives the request details.'
    }

    if (includesAny(text, ['quiz', 'recommendation quiz', 'watch quiz'])) {
        return 'The Watch Quiz asks style questions and recommends watches based on your answers. It is a quick way to guide customers who are not sure which model fits them.'
    }

    if (text.includes('gift')) {
        return 'Use the Gifting page to choose a watch and wrapping options. Gift details are saved with the cart item and then copied into the checkout order.'
    }

    if (includesAny(text, ['gift card', 'message card', 'gift message', 'wrap', 'wrapping'])) {
        return 'Gift orders can include wrapping and a gift card message. The backend stores gift wrapping name, price, card name, recipient name, and gift message with the cart and order item.'
    }

    if (includesAny(text, ['card', 'cash on delivery', 'cod', 'credit'])) {
        return 'Payment supports card checkout and cash on delivery. Card details are validated during checkout, while cash on delivery lets the customer pay when the order arrives.'
    }

    if (includesAny(text, ['secure', 'security', 'safe payment', 'safe checkout'])) {
        return 'Checkout is designed to validate payment inputs and store only safe order details. Sensitive card data is not saved as a full card number in the order.'
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

    if (includesAny(text, ['forgot password', 'reset password', 'password'])) {
        return 'Use the Forgot Password page to request a reset email. The backend creates a secure token, emails a reset link, and then lets the user set a new password.'
    }

    if (includesAny(text, ['email not sent', 'mail not sent', 'no email', 'spam'])) {
        return 'If an email does not appear, check Spam first. For reset and configuration emails, the backend sends mail through SMTP and the sender must be verified in the email provider.'
    }

    if (includesAny(text, ['dark mode', 'light mode', 'theme'])) {
        return 'The website supports dark and light mode. The theme switch changes the UI colors so customers can browse comfortably.'
    }

    if (includesAny(text, ['arabic', 'english', 'translation', 'translate', 'language'])) {
        return 'The website supports English and Arabic translation. The language switch changes translated interface text across the site.'
    }

    if (includesAny(text, ['currency', 'usd', 'egp', 'price currency'])) {
        return 'The currency switcher changes how prices are displayed on the frontend, while the backend keeps the original product prices in MongoDB.'
    }

    if (includesAny(text, ['water', 'waterproof', 'water resistance'])) {
        return 'Water resistance depends on the watch model. Check the product specifications for the exact rating before swimming or diving with a watch.'
    }

    if (includesAny(text, ['material', 'case material', 'strap', 'bracelet', 'movement'])) {
        return 'Each watch stores specifications such as case material, case diameter, movement, power reserve, water resistance, crystal, bracelet, and dial color.'
    }

    if (includesAny(text, ['care', 'clean', 'maintenance', 'service', 'repair'])) {
        return 'For care, keep the watch dry unless it is rated for water use, clean it with a soft cloth, and contact support for maintenance or repair requests.'
    }

    if (includesAny(text, ['automatic', 'quartz', 'mechanical', 'movement type'])) {
        return 'The movement type is shown in each watch specification. Automatic and mechanical watches focus on traditional craftsmanship, while quartz watches prioritize accuracy and low maintenance.'
    }

    if (includesAny(text, ['power reserve', 'battery'])) {
        return 'Power reserve appears in the watch specifications when available. It tells you how long a mechanical watch can run after being fully wound.'
    }

    if (includesAny(text, ['crystal', 'sapphire', 'glass'])) {
        return 'Crystal type is part of the watch specifications. Sapphire crystal is preferred in luxury watches because it is highly scratch resistant.'
    }

    if (includesAny(text, ['hour', 'open', 'schedule'])) {
        return 'Our concierge is available Monday to Friday from 9:00 AM to 6:00 PM, Saturday from 10:00 AM to 4:00 PM, and Sunday is closed.'
    }

    if (includesAny(text, ['brand', 'brands'])) {
        return 'Brands organize watches by maker, such as Rolex, Omega, Cartier, and Patek Philippe. The backend exposes them through GET /api/brands for shop filters and admin product forms.'
    }

    if (includesAny(text, ['slug', 'url name', 'clean url'])) {
        return 'A slug is the clean URL name of an item. For example, Noir Series becomes noir-series. It helps pages use readable URLs instead of database IDs.'
    }

    if (includesAny(text, ['collection', 'collections'])) {
        return 'Collections group watches into curated families. The backend exposes GET /api/collections and GET /api/collections/:slug for collection pages and filters.'
    }

    if (includesAny(text, ['filter', 'filters', 'search', 'sort', 'price range'])) {
        return 'The watches API supports search, brand, collection, category, gender, rating, min price, max price, and sorting. These power the Shop page filters.'
    }

    if (includesAny(text, ['review', 'rating'])) {
        return 'Reviews let logged-in users rate watches from 1 to 5 and write feedback. The backend stores reviews and recalculates the watch rating.'
    }

    if (includesAny(text, ['database', 'mongodb', 'mongo', 'atlas'])) {
        return 'The backend stores catalog, users, cart, wishlist, orders, reviews, and configuration requests in MongoDB Atlas through Mongoose models.'
    }

    if (includesAny(text, ['api', 'endpoint', 'backend route', 'route'])) {
        return 'The backend API follows Route -> Controller -> Service -> Model -> MongoDB. Routes receive requests, controllers return JSON, services handle logic, and models define database shape.'
    }

    if (includesAny(text, ['validation', 'validate', 'invalid'])) {
        return 'Forms validate on the frontend for user-friendly errors, and the backend validates again before saving important data like profile, orders, reviews, and configuration requests.'
    }

    if (includesAny(text, ['admin', 'dashboard', 'manage products', 'manage orders'])) {
        return 'The admin dashboard lets admins manage products, orders, users, reviews, and configuration requests. Protected routes require login and admin permission.'
    }

    if (includesAny(text, ['delete product', 'delete watch', 'remove product'])) {
        return 'When an admin deletes a watch, the backend also removes that watch from carts and wishlists so users do not keep broken references.'
    }

    if (includesAny(text, ['stock', 'available', 'availability', 'in stock'])) {
        return 'Stock is stored on each watch record. If stock is 0, the chatbot and product pages treat the watch as currently unavailable.'
    }

    if (includesAny(text, ['cookie', 'token', 'jwt', 'session'])) {
        return 'Authentication uses a JWT stored in an HTTP-only cookie. This keeps the frontend from manually storing the token and lets protected routes verify the logged-in user.'
    }

    if (includesAny(text, ['login', 'register', 'account', 'profile'])) {
        return 'Account features use authentication cookies. Users can register, log in, edit profile details, view orders, and keep cart or wishlist data connected to their account.'
    }

    if (includesAny(text, ['responsive', 'mobile', 'phone screen', 'small screen'])) {
        return 'The frontend is built responsively so pages like shop, quiz, configurator, cart, and checkout adapt to desktop and mobile screens.'
    }

    if (includesAny(text, ['loading', 'loader', 'loading page'])) {
        return 'The website includes loading states and transitions so users see feedback while pages, products, or actions are loading.'
    }

    if (includesAny(text, ['cursor', 'custom cursor'])) {
        return 'The custom cursor is a frontend visual feature that improves the luxury interaction style without changing backend data.'
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
        .select('name price category gender brand rating stock isActive specs')
        .sort({ rating: -1, price: 1 })
        .limit(40)

    const catalogReply = buildCatalogReply(cleanMessage, watches)
    if (catalogReply) return catalogReply

    return 'I can assist with watches, brands, collections, configurator requests, gifting, wishlist, cart, checkout, reviews, and account support. Try asking about a style, budget, or specific model.'
}

module.exports = { handleMessage }
