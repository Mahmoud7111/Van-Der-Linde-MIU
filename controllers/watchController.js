const watchService = require('../services/watchService')

const getWatches = async (req, res, next) => {
    try {
        const watches = await watchService.getWatches(req.query)
        res.status(200).json({
            success: true,
            message: 'OK',
            data: watches,
        })
    } catch (err) {
        next(err)
    }
}

const getWatchById = async (req, res, next) => {
    try {
        const watch = await watchService.getWatchById(req.params.id)
        res.status(200).json({
            success: true,
            message: 'OK',
            data: watch,
        })
    } catch (err) {
        next(err)
    }
}

const createWatch = async (req, res, next) => {
    try {
        const watch = await watchService.createWatch(req.body)
        res.status(201).json({
            success: true,
            message: 'Watch created',
            data: watch,
        })
    } catch (err) {
        next(err)
    }
}

const updateWatch = async (req, res, next) => {
    try {
        const watch = await watchService.updateWatch(req.params.id, req.body)
        res.status(200).json({
            success: true,
            message: 'Watch updated',
            data: watch,
        })
    } catch (err) {
        next(err)
    }
}

const deleteWatch = async (req, res, next) => {
    try {
        const result = await watchService.deleteWatch(req.params.id)
        res.status(200).json({
            success: true,
            message: 'Watch deleted',
            data: result,
        })
    } catch (err) {
        next(err)
    }
}

module.exports = {
    getWatches,
    getWatchById,
    createWatch,
    updateWatch,
    deleteWatch,
}
