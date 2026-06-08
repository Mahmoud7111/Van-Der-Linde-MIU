// name, email, password(hashed), role, googleId, address, isActive
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const addressSchema = new mongoose.Schema({
    street:  { type: String, default: '' },
    city:    { type: String, default: '' },
    state:   { type: String, default: '' },
    zip:     { type: String, default: '' },
    country: { type: String, default: '' },
}, { _id: false })

const userSchema = new mongoose.Schema({
    name: {
        type:     String,
        required: [true, 'Name is required'],
        trim:     true,
    },
    email: {
        type:      String,
        required:  [true, 'Email is required'],
        unique:    true,
        lowercase: true,
        trim:      true,
    },
    password: {
        type:   String,
        select: false, // never returned by default
    },
    role: {
        type:    String,
        enum:    ['user', 'admin'],
        default: 'user',
    },
    googleId: {
        type:   String,
        unique:  true,
        sparse:  true, // allows multiple null values
    },
    phone:    { type: String, default: '' },
    address:  { type: addressSchema, default: () => ({}) },
    isActive: { type: Boolean, default: true },
}, { timestamps: true })

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) return
    this.password = await bcrypt.hash(this.password, 12)
})

// Compare plain password to hashed
userSchema.methods.comparePassword = async function (plainPassword) {
    return bcrypt.compare(plainPassword, this.password)
}

module.exports = mongoose.model('User', userSchema)
