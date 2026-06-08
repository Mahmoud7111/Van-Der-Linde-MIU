const nodemailer = require('nodemailer')
const {
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASS,
    EMAIL_FROM,
} = require('../config/env')

const hasSmtpConfig = () => EMAIL_HOST && EMAIL_USER && EMAIL_PASS

const createTransporter = () => {
    if (!hasSmtpConfig()) {
        const err = new Error('Email SMTP settings are missing')
        err.statusCode = 500
        throw err
    }

    return nodemailer.createTransport({
        host: EMAIL_HOST,
        port: Number(EMAIL_PORT) || 587,
        secure: String(EMAIL_PORT) === '465',
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
    })
}

const sendEmail = async ({ to, subject, html, text = '' }) => {
    const transporter = createTransporter()
    const info = await transporter.sendMail({
        from: EMAIL_FROM || `"Van Der Linde" <${EMAIL_USER}>`,
        to,
        subject,
        html,
        text,
    })

    return info
}

module.exports = { sendEmail, hasSmtpConfig }
