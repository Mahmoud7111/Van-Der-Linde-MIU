//* Express config: middleware chain + route mounting + frontend serving
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

app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

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

// Serve frontend from the same Express app so everything is same-origin.
// The auth cookie is then first-party — works on every browser including mobile.
const staticDir = path.join(__dirname, 'views', 'dist')
if (fs.existsSync(staticDir)) {
    app.use(express.static(staticDir))
    app.get('*', (req, res) => {
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
}

module.exports = app