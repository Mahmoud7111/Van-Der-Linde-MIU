// user(ref), watchBase(ref), customizations{}, status, notes
const mongoose = require('mongoose')

const customizationsSchema = new mongoose.Schema({
    dialColor:    { type: String, default: '' },
    strapMaterial:{ type: String, default: '' },  // 'leather' | 'rubber' | 'steel'
    strapColor:   { type: String, default: '' },
    engravingText:{ type: String, default: '' },
    caseMaterial: { type: String, default: '' },  // 'steel' | 'gold' | 'titanium'
    additionalNotes: { type: String, default: '' },
}, { _id: false })

const configurationRequestSchema = new mongoose.Schema({
    user: {
        type:     mongoose.Schema.Types.ObjectId,
        ref:      'User',
        required: true,
    },
    watchBase: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  'Watch',
    },
    customizations: {
        type:    customizationsSchema,
        default: () => ({}),
    },
    status: {
        type:    String,
        enum:    ['pending', 'reviewing', 'quoted', 'approved', 'rejected', 'completed'],
        default: 'pending',
    },
    adminNotes:  { type: String, default: '' },  // internal notes from admin
    clientNotes: { type: String, default: '' },  // notes from the client
    estimatedPrice: { type: Number, default: null },
}, { timestamps: true })

module.exports = mongoose.model('ConfigurationRequest', configurationRequestSchema)
