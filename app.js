//* Express config: middleware chain + route mounting + static serving in prod
require('dotenv').config() // must be first — populates process.env before any other module reads it

const express = require('express')
const path = require('path')
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

// Middlewares - Order matters
app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

// For Vercel Serverless — ensure DB is ready before every request.
// The cached promise from connectDB means only the first cold-start pays the wait.
if (process.env.VERCEL) {
    app.use(async (req, res, next) => {
        try {
            await connectDB()
            next()
        } catch (err) {
            console.error('DB connection failed:', err)
            res.status(503).json({ success: false, message: 'Database unavailable', data: null })
        }
    })
}

app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'API is running' })
})

app.use('/api', routes)

// Serve frontend static files from the same Express app.
// This keeps frontend and backend on the same origin, so the auth cookie
// is a first-party cookie that no browser (desktop or mobile) blocks.
const staticDir = path.join(__dirname, 'views', 'dist')
app.use(express.static(staticDir))
app.get('*', (req, res) => {
    res.sendFile(path.join(staticDir, 'index.html'))
})

app.use(errorHandler) // must be last

// For local development, bind to PORT
if (!process.env.VERCEL) {
    connectDB().then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    })
    .catch(err => {
        console.error('DB connection failed:', err)
        process.exit(1)
    })
}

module.exports = app