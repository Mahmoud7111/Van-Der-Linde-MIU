//* Express config: middleware chain + route mounting + static serving in prod
require('dotenv').config() // must be first — populates process.env before any other module reads it

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

app.use(helmet())   
app.use(cors(corsOptions))
app.use(express.json())   //it read the body of the request and parse it to json
app.use(cookieParser())   // must be before routes so req.cookies is populated
app.use(morgan('dev'))    // for logging

app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'API is running' })
})

app.use('/api', routes) // routes are mounted at /api/... 
// The reason exists is to separate backend responses from frontend pages. Without it you'd have a collision:
// yoursite.com/watches  ← does React Router handle this? or Express?
// With the prefix there's no ambiguity:
// yoursite.com/watches      → React Router renders ShopPage
// yoursite.com/api/watches  → Express returns JSON

//It also makes the Vite proxy work cleanly. In vite.config.js you tell Vite: "any request starting with /api, forward it to the backend." Anything else stays in React. The prefix is what makes that rule possible.


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
} else {
    // For Vercel Serverless, just connect to the DB and export the app
    connectDB().catch(err => console.error('DB connection failed:', err));
}

module.exports = app