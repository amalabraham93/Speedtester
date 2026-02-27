const express = require('express');
const router = express.Router();
const TestResult = require('../models/TestResult');

const auth = require('../middleware/auth');

// Save Test Result (Auth Optional)
router.post('/save', async (req, res) => {
    try {
        const { downloadSpeed, uploadSpeed, ping, jitter, isp, city } = req.body;

        // Check for token manually if present, or rely on client sending userId
        // Better: decode token if present to verify userId
        let userId = null;
        if (req.header('Authorization')) {
            try {
                const token = req.header('Authorization').replace('Bearer ', '');
                const decoded = require('jsonwebtoken').verify(token, require('../config/auth.config').jwtSecret);
                userId = decoded.user.id;
            } catch (e) {
                console.warn('Invalid token on save, treating as guest');
            }
        }

        const newTest = new TestResult({
            userId: userId,
            downloadSpeed,
            uploadSpeed,
            ping,
            jitter,
            isp,
            city,
            ip: req.body.ip // Keep IP for guest tracking
        });

        await newTest.save();

        if (req.io) {
            req.io.emit('new_test', { isp, downloadSpeed, city });
        }

        res.json(newTest);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get History (Smart)
router.get('/history', async (req, res) => {
    try {
        // 1. If Auth Token Present -> Show User Account History
        if (req.header('Authorization')) {
            try {
                const token = req.header('Authorization').replace('Bearer ', '');
                const decoded = require('jsonwebtoken').verify(token, require('../config/auth.config').jwtSecret);
                // Return ALL history for this user
                const tests = await TestResult.find({ userId: decoded.user.id }).sort({ timestamp: -1 }).limit(100);
                return res.json(tests);
            } catch (e) {
                // Token invalid, fall through to guest mode
            }
        }

        // 2. If Guest -> Show History for their IP (if provided)
        const clientIp = req.query.ip;
        if (clientIp) {
            const tests = await TestResult.find({
                userId: null,
                ip: clientIp
            }).sort({ timestamp: -1 }).limit(50);
            return res.json(tests);
        }

        // 3. Fallback -> Return empty array (Privacy)
        res.json([]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get User History
router.get('/user/:userId', async (req, res) => {
    try {
        const tests = await TestResult.find({ userId: req.params.userId }).sort({ timestamp: -1 });
        res.json(tests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Upload test endpoint (accepts dummy data for speed test)
router.post('/upload', (req, res) => {
    // We don't need to do anything with the data, just acknowledge it.
    // The mere act of receiving it over the network measures the speed.
    res.status(200).json({ message: 'Upload received' });
});

// Proxy IP Endpoint to avoid CORS
router.get('/ip', async (req, res) => {
    const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' };

    try {
        // Try ipwho.is first
        const response = await fetch('https://ipwho.is/', { headers });
        const data = await response.json();

        if (!data.success) throw new Error('ipwho.is failed');

        res.json({
            ip: data.ip,
            city: data.city,
            region: data.region,
            country_name: data.country,
            org: (data.connection && (data.connection.isp || data.connection.org)) || 'Standard ISP',
            asn: data.connection ? data.connection.asn : null
        });
    } catch (error) {
        try {
            // Fallback to ipapi.co
            const response = await fetch('https://ipapi.co/json/', { headers });
            const data = await response.json();
            if (data.error || !response.ok) throw new Error('ipapi.co failed');
            res.json(data);
        } catch (fbError) {
            try {
                // Final effort: Just get the IP from ipify
                const response = await fetch('https://api.ipify.org?format=json', { headers });
                const data = await response.json();
                res.json({
                    ip: data.ip,
                    city: 'Local Node',
                    org: 'Detected ISP'
                });
            } catch (lastError) {
                console.error('All IP Detection services failed');
                res.status(500).json({ error: 'Failed to fetch IP info' });
            }
        }
    }
});

module.exports = router;
