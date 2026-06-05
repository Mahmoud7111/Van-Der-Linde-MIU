// configurator logic: save configuration request, send admin + customer emails
const ConfigurationRequest = require('../models/ConfigurationRequest')
const { sendEmail } = require('../utils/emailService')
const { ADMIN_EMAIL } = require('../config/env')

const submitConfiguration = async ({ userId, name, email, configuration }) => {
    const docData = { name, email, configuration }
    if (userId) docData.user = userId

    const request = await new ConfigurationRequest(docData).save()

    // Fire-and-forget: admin notification
    try {
        await sendEmail({
            to: ADMIN_EMAIL,
            subject: `New Watch Configuration Request — ${name}`,
            html: `
                <h2>New Configuration Request</h2>
                <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
                <h3>Configuration Details</h3>
                <ul>
                    <li><strong>Case Colour:</strong> ${configuration.caseColor || '—'}</li>
                    <li><strong>Dial Colour:</strong> ${configuration.dialColor || '—'}</li>
                    <li><strong>Strap Material:</strong> ${configuration.strapMaterial || '—'}</li>
                    <li><strong>Strap Colour:</strong> ${configuration.strapColor || '—'}</li>
                    <li><strong>Notes:</strong> ${configuration.notes || '—'}</li>
                </ul>
            `,
        })
    } catch (err) {
        console.error('Admin notification email failed:', err.message)
    }

    // Fire-and-forget: customer confirmation
    try {
        await sendEmail({
            to: email,
            subject: 'Your Van Der Linde Configuration Request',
            html: `
                <p>Dear ${name},</p>
                <p>Thank you for your personalised watch configuration request. We have received the following details:</p>
                <ul>
                    <li><strong>Case Colour:</strong> ${configuration.caseColor || '—'}</li>
                    <li><strong>Dial Colour:</strong> ${configuration.dialColor || '—'}</li>
                    <li><strong>Strap Material:</strong> ${configuration.strapMaterial || '—'}</li>
                    <li><strong>Strap Colour:</strong> ${configuration.strapColor || '—'}</li>
                    <li><strong>Notes:</strong> ${configuration.notes || '—'}</li>
                </ul>
                <p>Our team will be in touch with you within 2–3 business days.</p>
                <p><em>Crafting Legacy Since 1874</em></p>
            `,
        })
    } catch (err) {
        console.error('Customer confirmation email failed:', err.message)
    }

    return request
}

const getRequests = async () => {
    return ConfigurationRequest.find()
        .sort({ createdAt: -1 })
        .populate('user', 'name email')
}

module.exports = { submitConfiguration, getRequests }
