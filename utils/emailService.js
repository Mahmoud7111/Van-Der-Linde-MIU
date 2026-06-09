// Import nodemailer for sending emails
const nodemailer = require('nodemailer')

// Load email configuration settings from env configuration file
const {
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASS,
    EMAIL_FROM,
} = require('../config/env')

// Helper function to check if SMTP settings are fully configured in the environment variables
const hasSmtpConfig = () => EMAIL_HOST && EMAIL_USER && EMAIL_PASS

// Creates a Nodemailer transporter instance using the SMTP credentials
const createTransporter = () => {
    // If credentials are not set, throw a 500 error to prevent mailing attempts
    if (!hasSmtpConfig()) {
        const err = new Error('Email SMTP settings are missing')
        err.statusCode = 500
        throw err
    }

    // Configure the transport layer with host, port, security settings, and authentication
    return nodemailer.createTransport({
        host: EMAIL_HOST,
        port: Number(EMAIL_PORT) || 587, // Default to port 587 if not specified
        secure: String(EMAIL_PORT) === '465', // True if using port 465 (SSL/TLS), false otherwise
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
    })
}

// Asynchronous function to send an email using the configured transporter
const sendEmail = async ({ to, subject, html, text = '' }) => {
    // Create the SMTP transporter
    const transporter = createTransporter()
    
    // Send the email with sender, receiver, subject, HTML content, and optional plaintext fallback
    const info = await transporter.sendMail({
        from: EMAIL_FROM || `"Van Der Linde" <${EMAIL_USER}>`, // Use configured sender name or fallback to user email
        to,
        subject,
        html,
        text,
    })

    return info // Return details about the sent email (messageId, etc.)
}

// Export functions to be used by other services (e.g., configuratorService)
module.exports = { sendEmail, hasSmtpConfig }

