const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const auth = require('../middleware/auth');
const { OAuth2Client } = require('google-auth-library');
const config = require('../config/auth.config');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT
const generateToken = (userId) => {
    return jwt.sign(
        { user: { id: userId } },
        config.jwtSecret,
        { expiresIn: config.jwtExpire }
    );
};

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ name, email, password });
        await user.save();

        const token = generateToken(user.id);
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const token = generateToken(user.id);
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/google
// @desc    Google Login/Register
// @access  Public
router.post('/google', async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });


        const { name, email, picture, sub } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (user) {
            // Update Google ID if not present (merging account)
            if (!user.googleId) {
                user.googleId = sub;
                await user.save();
            }
        } else {
            // Create new user
            user = new User({
                name,
                email,
                password: crypto.randomBytes(20).toString('hex'), // Random password for google users
                googleId: sub,
                avatar: picture
            });
            await user.save();
        }

        const jwtToken = generateToken(user.id);
        res.json({ token: jwtToken, user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } });

    } catch (err) {
        console.error('Google Auth Error:', err);
        // Temporarily expose the error details to the frontend to help debug
        // WARNING: Remove this before final production release!
        res.status(401).json({
            msg: 'Google authentication failed',
            error: err.message,

            // Helpful debugging info:
            backend_client_id: process.env.GOOGLE_CLIENT_ID ?
                `...${process.env.GOOGLE_CLIENT_ID.slice(-6)}` : 'UNDEFINED', // Show last 6 chars only
        });
    }
});

// @route   GET api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
