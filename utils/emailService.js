// Nodemailer send function — selects correct template per event
const nodemailer = require('nodemailer')

// Create transporter — in dev uses Ethereal (fake SMTP), in prod uses env vars
const createTransporter = () => {
    if (process.env.NODE_ENV === 'production') {
        return nodemailer.createTransport({
            host:   process.env.EMAIL_HOST,
            port:   Number(process.env.EMAIL_PORT) || 587,
            secure: process.env.EMAIL_PORT === '465',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        })
    }

    // Development: log emails to console, don't actually send
    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: process.env.ETHEREAL_USER || 'dev@ethereal.email',
            pass: process.env.ETHEREAL_PASS || 'devpassword',
        },
    })
}

/**
 * Send an email.
 * @param {{ to: string, subject: string, html: string, text?: string }} options
 * @returns {Promise<void>}
 */
const sendEmail = async ({ to, subject, html, text = '' }) => {
    const transporter = createTransporter()
    const mailOptions = {
        from: `"Van Der Linde" <${process.env.EMAIL_USER || 'noreply@vanderlinde.com'}>`,
        to,
        subject,
        html,
        text,
    }

    try {
        const info = await transporter.sendMail(mailOptions)
        if (process.env.NODE_ENV !== 'production') {
            console.log(`📧 Email sent: ${nodemailer.getTestMessageUrl?.(info) || info.messageId}`)
        }
    } catch (err) {
        // Log but don't crash the request — email is non-critical
        console.error('❌ Email send failed:', err.message)
        throw err
    }
}

module.exports = { sendEmail }
