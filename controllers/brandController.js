const brandService = require('../services/brandService')

const getBrands = async (req, res, next) => {
    try {
        const brands = await brandService.getAll()
        res.status(200).json({
            success: true,
            message: 'OK',
            data: brands,
        })
    } catch (err) {
        next(err)
    }
}

module.exports = { getBrands }
