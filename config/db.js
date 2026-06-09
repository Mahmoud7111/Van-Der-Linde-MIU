// Connects the backend to MongoDB.
// Caches the connection across serverless invocations so we don't
// open a new connection on every request (which exhausts the Atlas pool).

const mongoose = require('mongoose')
const { MONGODB_URI } = require('./env')

/** Cached connection promise — survives container reuse on Vercel. */
let cachedPromise = null

const connectDB = async () => {
    if (cachedPromise) return cachedPromise

    cachedPromise = mongoose.connect(MONGODB_URI, {
        bufferCommands: false,          // fail immediately if disconnected, don't queue
        serverSelectionTimeoutMS: 5000, // give up after 5s instead of default 30s
        socketTimeoutMS: 45000,
        maxPoolSize: 10,                // keep pool small for serverless
    })

    const conn = await cachedPromise
    console.log(`MongoDB connected: ${conn.connection.host}`)
    return conn
}

module.exports = { connectDB }