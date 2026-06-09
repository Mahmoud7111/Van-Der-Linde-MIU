// submitConfig, getRequests
const configuratorService = require('../services/configuratorService')
const { assertLength, isEmail, normalizeEmail } = require('../utils/validationUtils')

const submitConfig = async (req, res, next) => {
    const { name, email, configuration } = req.body
    const userId = req.user?._id

    if (!configuration || typeof configuration !== 'object') 
        return res.status(400).json({ success: false, message: 'Configuration is required', data: null })

    let cleanName
    let cleanEmail

    try {
        cleanName = assertLength(name, 'Name', 2, 80) // assertLenght checks if the name is between 2 and 80 characters
        cleanEmail = normalizeEmail(email) // normalizeEmail removes extra spaces from email and converts it to lowercase
        if (!isEmail(cleanEmail)) {
            return res.status(400).json({ success: false, message: 'Please enter a valid email', data: null })
        }
    } catch (err) {
        return res.status(err.statusCode || 400).json({ success: false, message: err.message, data: null })
    }

    try {
        const request = await configuratorService.submitConfiguration({ userId, name: cleanName, email: cleanEmail, configuration })
        res.status(201).json({ success: true, message: 'Configuration submitted successfully', data: request })
    } catch (err) {
        next(err)
    }
}

const getRequests = async (req, res, next) => {
    try {
        const requests = await configuratorService.getRequests()
        res.status(200).json({ success: true, message: 'OK', data: requests })
    } catch (err) {
        next(err)
    }
}

module.exports = { submitConfig, getRequests }
