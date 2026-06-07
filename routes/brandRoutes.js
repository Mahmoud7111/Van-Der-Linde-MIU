const router = require('express').Router()

// /brands: GET all

module.exports = router

//! Placeholder — may be removed
//! The Controller/Routes: You do not need a bunch of public routes (like GET /api/brands) if the frontend never asks for a list of brands. When we fetch a watch, we will use .populate('brand') on the backend, which automatically attaches the brand's name and logo to the watch data before sending it to the frontend