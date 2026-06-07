// user(ref), token(hashed), expiresAt, isUsed
const mongoose = require('mongoose')

const passwordTokenSchema = new mongoose.Schema({
    user: {
        type:     mongoose.Schema.Types.ObjectId,
        ref:      'User',
        required: true,
    },
    token: {
        type:     String,
        required: true,
        // stored as SHA-256 hash — never store raw reset tokens in DB
    },
    expiresAt: {
        type:     Date,
        required: true,
    },
    isUsed: {
        type:    Boolean,
        default: false,
    },
}, { timestamps: true })

// Auto-delete expired tokens from DB after they expire
passwordTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

module.exports = mongoose.model('PasswordToken', passwordTokenSchema)

//! PasswordToken.js depends entirely on whether the frontend has a "Forgot Password" feature!

/*
A user forgets their password and enters their email on your frontend.
The backend generates a random token, saves it securely in the PasswordToken database model (with an expiration time, like 15 minutes), and emails the link to the user.
The user clicks the link, types a new password, and the backend checks the PasswordToken model to verify the link is valid and hasn't expired.
*/
