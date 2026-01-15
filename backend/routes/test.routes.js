const express = require('express');
const router = express.Router();
const TestResult = require('../models/TestResult');

// Save Test Result
router.post('/save', async (req, res) => {
    try {
        const { downloadSpeed, uploadSpeed, ping, jitter, isp, city, userId } = req.body;

        const newTest = new TestResult({
            userId: userId || null,
            downloadSpeed,
            uploadSpeed,
            ping,
            jitter,
            isp,
            city
        });

        await newTest.save();

        // Emit real-time update
        if (req.io) {
            req.io.emit('new_test', { isp, downloadSpeed, city });
        }

        res.json(newTest);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get History (Latest 10)
router.get('/history', async (req, res) => {
    try {
        const tests = await TestResult.find().sort({ timestamp: -1 }).limit(10);
        res.json(tests);
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
    try {
        // Dynamic import for fetch (node 18+) or use axios if available. 
        // Using native fetch since Node 18+ is likely used.
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('IP API Error');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Primary IP API failed:', error.message);
        try {
            // Fallback to ipwho.is
            const fallback = await fetch('https://ipwho.is/');
            const data = await fallback.json();
            res.json(data);
        } catch (fbError) {
            res.status(500).json({ error: 'Failed to fetch IP info' });
        }
    }
});

module.exports = router;
