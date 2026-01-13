require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const cron = require('node-cron');
const outageMonitor = require('./cron/outage-monitor');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all for now, lock down in prod
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/speedtracker')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io available in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/test', require('./routes/test.routes'));
app.use('/api/payment', require('./routes/payment.routes'));
app.use('/api/outage', require('./routes/outage.routes'));

// Cron Jobs
cron.schedule('*/15 * * * *', () => {
  console.log('Running Outage Monitor...');
  outageMonitor.checkOutages();
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
