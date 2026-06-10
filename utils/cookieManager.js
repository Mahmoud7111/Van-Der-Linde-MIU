// setCookie(res, token), clearCookie(res)
const { NODE_ENV } = require('../config/env')

const COOKIE_NAME = 'authToken'

// With Vercel rewrites proxying /api/* from the frontend domain to the backend,
// requests are now same-origin from the browser's perspective.  sameSite:'lax'
// avoids iOS Safari ITP blocks (Intelligent Tracking Prevention).
const isCrossOrigin = false

const setCookie = (res, token) => {
    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure:   isCrossOrigin,
        sameSite: isCrossOrigin ? 'none' : 'lax',
        maxAge:   7 * 24 * 60 * 60 * 1000,
    })
}

const clearCookie = (res) => {
    res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        secure:   isCrossOrigin,
        sameSite: isCrossOrigin ? 'none' : 'lax',
    })
}

module.exports = { setCookie, clearCookie }
