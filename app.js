//* Express config: middleware chain + route mounting
require('dotenv').config()

const express = require('express')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const { connectDB } = require('./config/db')
const { PORT } = require('./config/env')
const cors = require('cors')
const morgan = require('morgan')
const { corsOptions } = require('./config/cors')
const errorHandler = require('./middleware/errorHandler')
const routes = require('./routes/index')

const app = express()

if (process.env.VERCEL) {
    app.use((req, res, next) => {
        connectDB()
            .then(() => next())
            .catch(err => {
                console.error('DB connection failed:', err)
                res.status(503).json({ success: false, message: 'Database unavailable', data: null })
            })
    })
}

app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'API is running' })
})

app.use('/api', routes)

app.use(errorHandler)

if (!process.env.VERCEL) {
    connectDB().then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    })
    .catch(err => {
        console.error('DB connection failed:', err)
        process.exit(1)
    })
} else {
    connectDB().catch(err => console.error('DB connection failed:', err))
}

module.exports = app
