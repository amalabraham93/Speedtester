const axios = require('axios');
const Outage = require('../models/Outage');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Configure Nodemailer (Use env vars in prod)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const ISPs = ['Jio', 'Airtel', 'Vi', 'BSNL'];

const checkOutages = async () => {
    console.log('Checking for outages...');

    // REAL WORLD: Parse RSS feeds from DownDetector or similar
    // MOCK: Randomly simulate reports for this demo

    for (const isp of ISPs) {
        // Logic to fetch real data would go here
        // For demo, we check if we have recent "User Reports" in our own DB or simulate

        // Example: Scrape logic (Pseudo-code)
        // const feed = await axios.get(`https://downdetector.in/rss/${isp}`);
        // if feed indicates spike...

        // For now, let's just log. In a real app, integrate a feed parser.
    }
};

const reportUserOutage = async (isp, userId) => {
    // Logic when a user manually reports an outage
    let outage = await Outage.findOne({ isp, status: 'Active' });

    if (!outage) {
        outage = new Outage({ isp, reportCount: 1 });
    } else {
        outage.reportCount += 1;
    }

    await outage.save();

    // Trigger alert if threshold reached
    if (outage.reportCount > 50) {
        notifyPremiumUsers(isp);
    }

    return outage;
};

const notifyPremiumUsers = async (isp) => {
    const premiumUsers = await User.find({ isPremium: true });
    // Send emails
    premiumUsers.forEach(user => {
        // transporter.sendMail(...)
        console.log(`Sending outage alert to ${user.email} for ${isp}`);
    });
};

module.exports = { checkOutages, reportUserOutage };
