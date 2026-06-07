// Connects the backend to MongoDB.

const mongoose = require('mongoose')
const { MONGODB_URI } = require('./env')

const connectDB = async () => {
    const conn = await mongoose.connect(MONGODB_URI)
    console.log(`MongoDB connected: ${conn.connection.host}`)
}

module.exports = { connectDB }