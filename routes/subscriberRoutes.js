// /subscribers: POST subscribe, DELETE unsubscribe by token — public
const router = require('express').Router()
const { subscribe, unsubscribe } = require('../controllers/subscriberController')

router.post('/',        subscribe)
router.delete('/:token',unsubscribe)

module.exports = router