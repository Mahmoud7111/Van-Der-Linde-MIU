const router = require('express').Router()

// /watches/:id/reviews: public GET, protected POST (verified purchase)
//! Note that we might not be doing reviews at all, but if we do, this is where they would go.

module.exports = router