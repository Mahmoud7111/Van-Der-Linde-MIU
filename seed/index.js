// clears DB then runs all seeders in order
require('dotenv').config()

const { connectDB } = require('../config/db')
const mongoose = require('mongoose')

const runSeed = async () => {
    await connectDB()
    await mongoose.connection.dropDatabase()
    console.log('🗑️  DB cleared')

    const brandsSeed = require('./brands.seed.js')
    const collectionsSeed = require('./collections.seed.js')
    const watchesSeed = require('./watches.seed.js')
    const usersSeed = require('./users.seed.js')

    const brands = await brandsSeed()
    const collections = await collectionsSeed(brands)
    await watchesSeed(brands, collections)
    await usersSeed()

    console.log('✅ Seed complete')
    process.exit(0)
}

runSeed().catch(err => {
    console.error('❌ Seed failed:', err)
    process.exit(1)
})