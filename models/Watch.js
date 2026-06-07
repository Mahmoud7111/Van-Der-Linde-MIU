// name, brand(ref), collection(ref), price, category, images[], stock, rating, specs, slug
const mongoose = require('mongoose')

const specsSchema = new mongoose.Schema({
    caseMaterial:  { type: String, default: '' },
    caseDiameter:  { type: String, default: '' },   // e.g. "40mm"
    movement:      { type: String, default: '' },   // e.g. "Automatic"
    powerReserve:  { type: String, default: '' },   // e.g. "48 hours"
    waterResistance:{ type: String, default: '' },  // e.g. "100m"
    crystal:       { type: String, default: '' },   // e.g. "Sapphire"
    bracelet:      { type: String, default: '' },   // e.g. "Oyster"
    dialColor:     { type: String, default: '' },
}, { _id: false })

const watchSchema = new mongoose.Schema({
    name: {
        type:     String,
        required: [true, 'Watch name is required'],
        trim:     true,
    },
    slug: {
        type:      String,
        required:  [true, 'Slug is required'],
        unique:    true,
        lowercase: true,
        trim:      true,
    },
    brand: {
        type:     mongoose.Schema.Types.ObjectId,
        ref:      'Brand',
        required: [true, 'Brand is required'],
    },
    collection: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  'Collection',
    },
    price: {
        type:     Number,
        required: [true, 'Price is required'],
        min:      0,
    },
    gender: {
        type:    String,
        enum:    ['men', 'women', 'unisex'],
        default: 'unisex',
    },
    category: {
        type:    String,
        enum:    ['dress', 'sport', 'dive', 'pilot', 'luxury', 'casual', 'classic', 'smart'],
        default: 'luxury',
    },
    images:      { type: [String], default: [] },   // array of image URLs
    stock:       { type: Number, default: 0, min: 0 },
    rating:      { type: Number, default: 0, min: 0, max: 5 },
    numReviews:  { type: Number, default: 0 },
    specs:       { type: specsSchema, default: () => ({}) },
    description: { type: String, default: '' },
    isFeatured:  { type: Boolean, default: false },
    isActive:    { type: Boolean, default: true },
}, { timestamps: true })

// Text index for search
watchSchema.index({ name: 'text', description: 'text' })

module.exports = mongoose.model('Watch', watchSchema)
