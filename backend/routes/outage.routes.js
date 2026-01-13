const express = require('express');
const router = express.Router();
const Outage = require('../models/Outage');
const { reportUserOutage } = require('../cron/outage-monitor');

// Get all outages
router.get('/', async (req, res) => {
    try {
        const outages = await Outage.find({ status: 'Active' });
        res.json(outages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Report an outage manually
router.post('/report', async (req, res) => {
    try {
        const { isp, userId } = req.body;
        const outage = await reportUserOutage(isp, userId);
        res.json(outage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
