const Watch = require('../models/Watch')
const Cart = require('../models/Cart')
const Wishlist = require('../models/Wishlist')
const Brand = require('../models/Brand')
const Collection = require('../models/Collection')

const isObjectId = (value) =>
    typeof value === 'string' && /^[0-9a-fA-F]{24}$/.test(value)

const escapeRegex = (text) =>
    text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const slugify = (text) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

const makeError = (msg, code) => {
    const err = new Error(msg)
    err.statusCode = code
    return err
}

const resolveRefByNameOrId = async (Model, value, label) => {
    if (!value || isObjectId(value)) return value

    const doc = await Model.findOne({
        name: new RegExp(`^${escapeRegex(value)}$`, 'i'),
    })

    if (!doc) {
        throw makeError(`${label} '${value}' not found`, 400)
    }

    return doc._id
}

const getWatches = async (filters = {}) => {
    const query = {}

    if (filters.category && filters.category !== 'all') {
        query.category = filters.category
    }

    if (filters.collection && filters.collection !== 'all') {
        const collectionDoc = await Collection.findOne({
            name: new RegExp(`^${escapeRegex(filters.collection)}$`, 'i'),
        })

        if (!collectionDoc) return []
        query.collection = collectionDoc._id
    }

    if (filters.search) {
        query.name = {
            $regex: escapeRegex(filters.search),
            $options: 'i',
        }
    }

    if (filters.brand && filters.brand !== 'all') {
        query.brand = await resolveRefByNameOrId(Brand, filters.brand, 'Brand')
    }

    if (filters.gender && filters.gender !== 'all') {
        query.gender = filters.gender
    }

    if (filters.rating && filters.rating !== 'all') {
        query.rating = { $gte: Number(filters.rating) }
    }

    if (filters.minPrice != null || filters.maxPrice != null) {
        query.price = {}
        if (filters.minPrice != null) query.price.$gte = Number(filters.minPrice)
        if (filters.maxPrice != null) query.price.$lte = Number(filters.maxPrice)
    }

    let sort = { createdAt: -1 }
    if (filters.sort === 'price-asc') {
        sort = { price: 1 }
    } else if (filters.sort === 'price-desc') {
        sort = { price: -1 }
    } else if (filters.sort === 'rating') {
        sort = { rating: -1 }
    }

    return Watch.find(query)
        .sort(sort)
        .populate('brand', 'name slug')
        .populate('collection', 'name slug')
}

const getWatchById = async (id) => {
    const watch = await Watch.findById(id)
        .populate('brand', 'name slug')
        .populate('collection', 'name slug')

    if (!watch) throw makeError('Watch not found', 404)
    return watch
}

const ensureUniqueSlug = async (baseSlug) => {
    let slug = baseSlug
    let counter = 1
    while (await Watch.exists({ slug })) {
        slug = `${baseSlug}-${counter}`
        counter++
    }
    return slug
}

const createWatch = async (data) => {
    if (data.name && !data.slug) {
        data.slug = await ensureUniqueSlug(slugify(data.name))
    }

    if (data.brand) {
        data.brand = await resolveRefByNameOrId(Brand, data.brand, 'Brand')
    }

    if (data.collection) {
        data.collection = await resolveRefByNameOrId(Collection, data.collection, 'Collection')
    }

    return Watch.create(data)
}

const updateWatch = async (id, data) => {
    if (data.slug) {
        data.slug = await ensureUniqueSlug(data.slug)
    }

    if (data.brand) {
        data.brand = await resolveRefByNameOrId(Brand, data.brand, 'Brand')
    }

    if (data.collection) {
        data.collection = await resolveRefByNameOrId(Collection, data.collection, 'Collection')
    }

    const watch = await Watch.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    })

    if (!watch) throw makeError('Watch not found', 404)
    return watch
}

const deleteWatch = async (id) => {
    const watch = await Watch.findByIdAndDelete(id)
    if (!watch) throw makeError('Watch not found', 404)

    await Promise.all([
        Cart.updateMany({}, { $pull: { items: { watch: id } } }),
        Wishlist.updateMany({}, { $pull: { watches: id } }),
    ])

    return { id }
}

module.exports = {
    getWatches,
    getWatchById,
    createWatch,
    updateWatch,
    deleteWatch,
}