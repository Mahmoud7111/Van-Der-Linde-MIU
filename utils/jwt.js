// signToken(id), verifyToken(token) — wraps jsonwebtoken
const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_EXPIRE } = require('../config/env')

/**
 * Sign a JWT for a given user ID.
 * @param {string} id - MongoDB user _id
 * @returns {string} signed JWT
 */
const signToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRE })
}

/**
 * Verify and decode a JWT.
 * Throws if token is expired or tampered.
 * @param {string} token
 * @returns {{ id: string, iat: number, exp: number }}
 */
const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET)
}

module.exports = { signToken, verifyToken }