const mongoose = require('mongoose');

const OutageSchema = new mongoose.Schema({
    isp: { type: String, required: true }, // 'Jio', 'Airtel', etc.
    reportCount: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Resolved'], default: 'Active' },
    detectedAt: { type: Date, default: Date.now },
    resolvedAt: { type: Date }
});

module.exports = mongoose.model('Outage', OutageSchema);
