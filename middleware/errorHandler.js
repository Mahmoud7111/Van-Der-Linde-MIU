// global error catcher — LAST middleware in app.js; returns clean JSON

module.exports = (err, req, res, next) => {
    console.error(err.stack)
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({ success: false, message: err.message || 'Internal server error', data: null })
}
