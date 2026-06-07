const Watch = require('../models/Watch')

const getWatches = async (filters = {}) => {
    const query = {}

    if (filters.category && filters.category !== 'all') {
        query.category = filters.category
    }

    if (filters.search) {
        query.name = { $regex: filters.search, $options: 'i' }
    }

    if (filters.brand) {
        query.brand = filters.brand
    }

    let sort = { createdAt: -1 }

    if (filters.sort === 'price-asc') {
        sort = { price: 1 }
    } else if (filters.sort === 'price-desc') {
        sort = { price: -1 }
    } else if (filters.sort === 'rating') {
        sort = { rating: -1 }
    }

    const watches = await Watch.find(query)
        .sort(sort)
        .populate('brand', 'name slug')
        .populate('collection', 'name slug')

    return watches
}

const getWatchById = async (id) => {
    const watch = await Watch.findById(id)
        .populate('brand', 'name slug')
        .populate('collection', 'name slug')

    if (!watch) {
        const err = new Error('Watch not found')
        err.statusCode = 404
        throw err
    }

    return watch
}

const createWatch = async (data) => {
    const watch = await Watch.create(data)
    return watch
}

const updateWatch = async (id, data) => {
    const watch = await Watch.findByIdAndUpdate(id, data, { new: true })

    if (!watch) {
        const err = new Error('Watch not found')
        err.statusCode = 404
        throw err
    }

    return watch
}

const deleteWatch = async (id) => {
    const watch = await Watch.findByIdAndDelete(id)

    if (!watch) {
        const err = new Error('Watch not found')
        err.statusCode = 404
        throw err
    }

    return { id }
}

module.exports = {
    getWatches,
    getWatchById,
    createWatch,
    updateWatch,
    deleteWatch,
}
