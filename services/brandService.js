const Brand = require('../models/Brand')

const getAll = async () => {
    const brands = await Brand.find().lean()
    return brands
}

module.exports = { getAll }
