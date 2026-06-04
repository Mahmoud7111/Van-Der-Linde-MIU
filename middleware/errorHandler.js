// global error catcher — LAST middleware in app.js; returns clean JSON

const { error } = require('../utils/apiResponse')

module.exports = (err, req, res, next) => {
    console.error(err.stack)
    const statusCode = err.statusCode || 500
    error(res, err.message || 'Internal server error', statusCode)
}
