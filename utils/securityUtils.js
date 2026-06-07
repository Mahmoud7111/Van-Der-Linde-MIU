// generateToken(), hashToken(token), sanitizeInput(str)
const crypto = require('crypto')

/**
 * Generate a cryptographically secure random hex token.
 * Used for password reset links and unsubscribe tokens.
 * @param {number} bytes - Number of random bytes (default 32 → 64-char hex)
 * @returns {string} raw token (send this to the user via email)
 */
const generateToken = (bytes = 32) => {
    return crypto.randomBytes(bytes).toString('hex')
}

/**
 * Hash a raw token with SHA-256 before storing in DB.
 * Never store raw tokens — this way even if DB is leaked, tokens are useless.
 * @param {string} rawToken
 * @returns {string} SHA-256 hex digest
 */
const hashToken = (rawToken) => {
    return crypto.createHash('sha256').update(rawToken).digest('hex')
}

/**
 * Basic sanitizer: trims whitespace and strips HTML tags.
 * Use on user-supplied strings before storing (belt-and-suspenders with Mongoose validation).
 * @param {string} str
 * @returns {string}
 */
const sanitizeInput = (str = '') => {
    return String(str).trim().replace(/<[^>]*>/g, '')
}

module.exports = { generateToken, hashToken, sanitizeInput }
