// clears DB then runs all seeders in order
require('dotenv').config()

const { connectDB } = require('../config/db')
const mongoose = require('mongoose')

const runSeed = async () => {
    await connectDB()
    await mongoose.connection.dropDatabase()
    console.log('🗑️  DB cleared')

    await require('./brands.seed')()
    await require('./collections.seed')()
    await require('./watches.seed')()
    await require('./users.seed')()

    console.log('✅ Seed complete')
    process.exit(0)
}

runSeed().catch(err => {
    console.error('❌ Seed failed:', err)
    process.exit(1)
})

// Seed data must mirror the shape of your frontend mock JSON files exactly — same field names, same structure.
// This is the most important thing to get right before integration.
// Sit with client/src/data/products.json open while writing watches.seed.js and copy the shape field by field.