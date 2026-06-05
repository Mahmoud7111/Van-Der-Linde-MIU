// submitConfig, getRequests
const configuratorService = require('../services/configuratorService')

const submitConfig = async (req, res, next) => {
    const { name, email, configuration } = req.body
    const userId = req.user?._id

    if (!name || !email || !configuration)
        return res.status(400).json({ success: false, message: 'Name, email and configuration are required', data: null })

    try {
        const request = await configuratorService.submitConfiguration({ userId, name, email, configuration })
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
