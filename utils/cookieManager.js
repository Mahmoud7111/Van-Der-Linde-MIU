// setCookie(res, token), clearCookie(res)
const { NODE_ENV } = require('../config/env')

const COOKIE_NAME = 'authToken'

const setCookie = (res, token) => {
    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,                          // JS cannot access it — XSS protection
        secure:   NODE_ENV === 'production',     // HTTPS only in prod
        sameSite: NODE_ENV === 'production' ? 'none' : 'lax', // cross-site in prod (for Vercel/Render split)
        maxAge:   7 * 24 * 60 * 60 * 1000,      // 7 days in ms
    })
}

const clearCookie = (res) => {
    res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        secure:   NODE_ENV === 'production',
        sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
    })
}

module.exports = { setCookie, clearCookie }
