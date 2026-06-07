// name, logo, description, slug
const mongoose = require('mongoose')

const brandSchema = new mongoose.Schema({
    name: {
        type:     String,
        required: [true, 'Brand name is required'],
        trim:     true,
        unique:   true,
    },
    slug: {
        type:     String,
        required: [true, 'Slug is required'],
        unique:   true,
        lowercase: true,
        trim:     true,
    },
    logo:        { type: String, default: '' },       // image URL
    description: { type: String, default: '' },
    isActive:    { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('Brand', brandSchema)
