const router = require('express').Router()
const {
    getWatches,
    getWatchById,
    createWatch,
    updateWatch,
    deleteWatch,
} = require('../controllers/watchController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.get('/', getWatches)
router.get('/:id', getWatchById)
router.post('/', protect, adminOnly, createWatch)
router.put('/:id', protect, adminOnly, updateWatch)
router.delete('/:id', protect, adminOnly, deleteWatch)

module.exports = router
