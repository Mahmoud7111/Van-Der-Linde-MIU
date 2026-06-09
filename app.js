//* Express config: middleware chain + route mounting + static frontend serving
require('dotenv').config()

const express = require('express')
const path = require('path')
const fs = require('fs')
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

// On Vercel, ensure DB is connected before every request (cached promise makes it fast).
// Must NOT be async — Express 5's async wrapper can crash the serverless function.
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

// Serve frontend from the same Express app so auth is same-origin.
const staticDir = path.join(__dirname, 'views', 'dist')
if (fs.existsSync(staticDir)) {
    app.use(express.static(staticDir))
    app.use((req, res) => {
        res.sendFile(path.join(staticDir, 'index.html'))
    })
}

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
