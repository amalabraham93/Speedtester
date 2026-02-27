const mongoose = require('mongoose');
require('dotenv').config();
const Blog = require('./models/Blog');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/speedtracker';

const blogs = [
    {
        title: 'How to Correct Your Internet Results for Gaming',
        slug: 'fix-internet-speed-for-gaming',
        excerpt: 'High latency and jitter can ruin your gaming experience. Learn how to optimize your network for competitive play.',
        content: `
      <h2>Understanding Ping and Latency</h2>
      <p>In competitive gaming, every millisecond counts. Latency, also known as **Ping**, is the time it takes for data to travel from your computer to the server and back. If your ping is over 100ms, you'll experience noticeable lag.</p>
      
      <h2>Step 1: Use a Wired Connection</h2>
      <p>WiFi is convenient, but it introduces interference. For gaming, always use an Ethernet cable (Cat6 or Cat7). This ensures a stable connection and lowers your jitter.</p>
      
      <h2>Step 2: Optimize Your DNS Settings</h2>
      <p>Using a faster DNS like Google (8.8.8.8) or Cloudflare (1.1.1.1) can reduce the time it takes to resolve server addresses, giving you a slight edge in matchmaking.</p>
      
      <h2>Step 3: Quality of Service (QoS)</h2>
      <p>Enable QoS on your router to prioritize gaming traffic over other background downloads like Netflix or Windows updates.</p>
    `,
        category: 'Gaming',
        tags: ['gaming', 'latency', 'ping', 'optimization'],
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000'
    },
    {
        title: 'Top 5 ISPs in India for Remote Workers in 2026',
        slug: 'best-isps-india-remote-work',
        excerpt: 'Reliability is paramount for remote work. We analyze the top 5 broadband providers based on uptime and upload speeds.',
        content: `
      <h2>The Shift to Remote Work</h2>
      <p>Reliable internet is no longer a luxury; it's a workspace requirement. In India, several ISPs have stepped up their infrastructure game.</p>
      
      <h2>1. Airtel Xstream Fiber</h2>
      <p>With massive uptime and consistent fiber speeds, Airtel remains a top choice for professionals requiring stable video conferencing.</p>
      
      <h2>2. Jio Fiber</h2>
      <p>Known for its aggressive pricing and widespread availability, Jio is excellent for high-bandwidth home offices.</p>
      
      <h2>3. ACT Fibernet</h2>
      <p>A favorite among gamers and tech workers in metropolitan cities for its symmetrical upload and download speeds.</p>
    `,
        category: 'ISP Analysis',
        tags: ['india', 'isp', 'broadband', 'remote-work'],
        image: 'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?auto=format&fit=crop&q=80&w=1000'
    }
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        await Blog.deleteMany({}); // Optional: Clear existing
        await Blog.insertMany(blogs);

        console.log('Successfully seeded blog content!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seed();
