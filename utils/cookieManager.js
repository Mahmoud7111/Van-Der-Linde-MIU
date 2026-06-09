// setCookie(res, token), clearCookie(res)
const { NODE_ENV } = require('../config/env')

const COOKIE_NAME = 'authToken'

// On Vercel, frontend and backend are on different subdomains, which is a cross-origin
// context. The cookie MUST use sameSite:'none' + secure:true so the browser sends it on
// fetch() requests with credentials:'include'.  sameSite:'lax' would block them.
const isCrossOrigin = process.env.VERCEL || NODE_ENV === 'production'

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
