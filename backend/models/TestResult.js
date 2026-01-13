const mongoose = require('mongoose');

const TestResultSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Null for guest users
    downloadSpeed: { type: Number, required: true }, // Mbps
    uploadSpeed: { type: Number, required: true }, // Mbps
    ping: { type: Number, required: true }, // ms
    jitter: { type: Number, required: true }, // ms
    isp: { type: String, default: 'Unknown' },
    city: { type: String },
    region: { type: String },
    country: { type: String },
    ip: { type: String },
    device: { type: String }, // 'mobile', 'desktop'
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TestResult', TestResultSchema);
