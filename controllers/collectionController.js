const collectionService = require('../services/collectionService')

const getCollections = async (req, res, next) => {
    try {
        const collections = await collectionService.getAll()
        res.status(200).json({
            success: true,
            message: 'OK',
            data: collections,
        })
    } catch (err) {
        next(err)
    }
}

const getCollectionBySlug = async (req, res, next) => {
    try {
        const collection = await collectionService.getBySlug(req.params.slug)
        res.status(200).json({
            success: true,
            message: 'OK',
            data: collection,
        })
    } catch (err) {
        next(err)
    }
}

module.exports = { getCollections, getCollectionBySlug }
