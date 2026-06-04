// Controls which frontend can call your backend.
// This file is used by the CORS middleware in app.js to determine which origins are allowed to make requests to the backend.

const { FRONTEND_URL } = require('./env')

const corsOptions = {
    origin: ['http://localhost:5173', FRONTEND_URL],
    credentials: true,
}

module.exports = { corsOptions }