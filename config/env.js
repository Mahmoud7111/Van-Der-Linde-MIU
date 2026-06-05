// Loads environment variables from the .env file.

require('dotenv').config()

module.exports = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
    GEMINI_API_KEY: process.env.GEN_AI_KEY,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
}
