const ConfigurationRequest = require('../models/ConfigurationRequest')
const { sendEmail } = require('../utils/emailService')
const { ADMIN_EMAIL } = require('../config/env')
const { cleanString, normalizeEmail } = require('../utils/validationUtils')

const escapeHtml = (value = '') => String(value) //Prevents HTML injection. 
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const formatPrice = (value) => {
    const amount = Number(value)
    if (!Number.isFinite(amount)) return 'Not provided'
    return `$${amount.toLocaleString('en-US')}`
}

const buildConfigurationRows = (configuration = {}) => { // builds the configuration rows for the email
    const rows = [
        ['Model', configuration.model],
        ['Case', configuration.caseColor],
        ['Bezel', configuration.bezelColor],
        ['Dial', configuration.dialColor],
        ['Strap', configuration.strapMaterial],
        ['Strap Color', configuration.strapColor],
        ['Estimated Price', formatPrice(configuration.estimatedPrice)],
        ['Notes', configuration.notes],
    ]

    return rows.map(([label, value]) => `
        <tr>
            <td style="padding:8px 12px;border:1px solid #ddd;"><strong>${label}</strong></td>
            <td style="padding:8px 12px;border:1px solid #ddd;">${escapeHtml(value || 'Not provided')}</td>
        </tr>
    `).join('')
}

const buildEmailLayout = (title, bodyHtml) => `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2933;">
        <h2 style="color:#111827;">${escapeHtml(title)}</h2>
        ${bodyHtml}
        <p style="margin-top:24px;color:#8a6a2f;"><em>Van Der Linde - Crafting Legacy Since 1874</em></p>
    </div>
`

const submitConfiguration = async ({ userId, name, email, configuration }) => {
    const normalizedEmail = normalizeEmail(email) // removes extra spaces from email and converts it to lowercase
    const cleanName = cleanString(name) // removes extra spaces from name and converts it to lowercase
    const cleanConfiguration = {
        model:          cleanString(configuration?.model),
        caseColor:      cleanString(configuration?.caseColor),
        bezelColor:     cleanString(configuration?.bezelColor),
        dialColor:      cleanString(configuration?.dialColor),
        strapMaterial:  cleanString(configuration?.strapMaterial),
        strapColor:     cleanString(configuration?.strapColor),
        estimatedPrice: Math.max(0, Number(configuration?.estimatedPrice) || 0),
        notes:          cleanString(configuration?.notes).slice(0, 1000),
    }
    const docData = { name: cleanName, email: normalizedEmail, configuration: cleanConfiguration }
    if (userId) docData.user = userId

    const request = await ConfigurationRequest.create(docData) // save configuration request to database
    const rows = buildConfigurationRows(cleanConfiguration) // builds the configuration rows for the email

    if (!ADMIN_EMAIL) {
        console.error('Admin email failed: ADMIN_EMAIL is missing') 
    } else {
        try { // try sending admin email
            await sendEmail({ //sending admin email
                to: ADMIN_EMAIL,
                subject: `New configuration request from ${cleanName}`,
                html: buildEmailLayout('New Configuration Request', `
                    <p><strong>Customer:</strong> ${escapeHtml(cleanName)} &lt;${escapeHtml(normalizedEmail)}&gt;</p>
                    <p><strong>Request ID:</strong> ${request._id}</p>
                    <table style="border-collapse:collapse;width:100%;max-width:640px;">
                        ${rows}
                    </table>
                `),
            })
        } catch (err) {
            console.error('Admin notification email failed:', err.message)
        }
    }

    try { // sending customer email
        await sendEmail({
            to: normalizedEmail,
            subject: 'We received your Van Der Linde configuration request',
            html: buildEmailLayout('Your Configuration Request Is Confirmed', `
                <p>Dear ${escapeHtml(cleanName)},</p>
                <p>Thank you for submitting your personalized watch request. Our team received your configuration and will contact you within 2-3 business days.</p>
                <table style="border-collapse:collapse;width:100%;max-width:640px;">
                    ${rows}
                </table>
            `),
        })
    } catch (err) {
        console.error('Customer confirmation email failed:', err.message)
    }

    return request // returns the configuration request
}

const getRequests = async () => {
    return ConfigurationRequest.find() // finds all configuration requests
        .sort({ createdAt: -1 }) // sorts configuration requests by creation date in descending order
        .populate('user', 'name email') // populates the user field with name and email
}

module.exports = { submitConfiguration, getRequests }
