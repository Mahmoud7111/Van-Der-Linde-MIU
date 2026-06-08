// user(ref, optional), name, email, configuration{}, status
const mongoose = require('mongoose')

const configurationSchema = new mongoose.Schema({
    model:         { type: String, default: '' },
    caseColor:     { type: String, default: '' },
    bezelColor:    { type: String, default: '' },
    dialColor:     { type: String, default: '' },
    strapMaterial: { type: String, default: '' },
    strapColor:    { type: String, default: '' },
    estimatedPrice:{ type: Number, default: 0 },
    notes:         { type: String, default: '' },
}, { _id: false })

const configurationRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  'User',
    },
    name:  { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    configuration: {
        type:    configurationSchema,
        default: () => ({}),
    },
    status: {
        type:    String,
        enum:    ['pending', 'contacted', 'fulfilled'],
        default: 'pending',
    },
}, { timestamps: true })

module.exports = mongoose.model('ConfigurationRequest', configurationRequestSchema)
