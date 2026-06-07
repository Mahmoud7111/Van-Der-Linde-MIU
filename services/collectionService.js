const Collection = require('../models/Collection')

const getAll = async () => {
    const collections = await Collection.find().lean()
    return collections
}

const getBySlug = async (slug) => {
    const collection = await Collection.findOne({ slug }).lean()

    if (!collection) {
        const err = new Error('Collection not found')
        err.statusCode = 404
        throw err
    }

    return collection
}

module.exports = { getAll, getBySlug }
