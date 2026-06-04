// success(res, data, msg) and error(res, msg, status) — used in every controller

const success = (res, data = null, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({ success: true, message, data })
}

const error = (res, message = 'Server error', statusCode = 500) => {
    res.status(statusCode).json({ success: false, message, data: null })
}

module.exports = { success, error }
