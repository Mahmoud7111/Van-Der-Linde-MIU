// name, description, coverImage, watches[], slug
const mongoose = require('mongoose')

const collectionSchema = new mongoose.Schema({
    name: {
        type:     String,
        required: [true, 'Collection name is required'],
        trim:     true,
    },
    slug: {
        type:      String,
        required:  [true, 'Slug is required'],
        unique:    true,
        lowercase: true,
        trim:      true,
    },
    description: { type: String, default: '' },
    coverImage:  { type: String, default: '' }, // image URL
    isActive:    { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('Collection', collectionSchema)
