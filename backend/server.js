require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const cron = require('node-cron');
const outageMonitor = require('./cron/outage-monitor');

const authRoutes = require('./routes/auth.routes');
const testRoutes = require('./routes/test.routes');
const outageRoutes = require('./routes/outage.routes');
const blogRoutes = require('./routes/blog.routes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all for now, lock down in prod
    methods: ['GET', 'POST']
  }
});

const helmet = require('helmet');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');

// ... (socket.io setup)

// Middleware implementation
// 1. Set Security Headers
app.use(helmet());

// 2. Prevent HTTP Parameter Pollution
app.use(hpp());

// 3. Rate Limiting: 1000 requests per 10 minutes
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 1000,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// 4. CORS Setup
const allowedOrigins = [
  'http://localhost:4200',                 // Local Dev
  'http://localhost:4000',                 // Local Dev
  'https://speedtester-six.vercel.app'     // Production Frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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
app.use('/api/blog', require('./routes/blog.routes'));
app.use('/', require('./routes/seo.routes')); // For sitemap.xml and robots.txt at root

// Cron Jobs
cron.schedule('*/15 * * * *', () => {
  console.log('Running Outage Monitor...');
  outageMonitor.checkOutages();
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
