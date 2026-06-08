const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^\+?[0-9\s\-()]{7,20}$/
const POSTAL_REGEX = /^[A-Za-z0-9\s-]{3,12}$/

const makeError = (message, statusCode = 400) => {
    const err = new Error(message)
    err.statusCode = statusCode
    return err
}

const cleanString = (value) => String(value || '').trim()

const normalizeEmail = (value) => cleanString(value).toLowerCase()

const isEmail = (value) => EMAIL_REGEX.test(cleanString(value))

const isPhone = (value) => PHONE_REGEX.test(cleanString(value))

const isPostalCode = (value) => POSTAL_REGEX.test(cleanString(value))

const assertLength = (value, label, min, max) => {
    const cleaned = cleanString(value)
    if (cleaned.length < min) throw makeError(`${label} must be at least ${min} characters`, 400)
    if (max && cleaned.length > max) throw makeError(`${label} must be ${max} characters or less`, 400)
    return cleaned
}

module.exports = {
    makeError,
    cleanString,
    normalizeEmail,
    isEmail,
    isPhone,
    isPostalCode,
    assertLength,
}
