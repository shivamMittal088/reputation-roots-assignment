const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const searchRoutes = require('./routes/searchRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

/* ==============================
   CORS CONFIGURATION
============================== */

const allowedOrigins = [
  'https://reputation-roots-assignment-5nsq.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman / mobile apps (no origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('❌ CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

/* ==============================
   HANDLE PREFLIGHT REQUESTS
   (Fix 401 on OPTIONS)
============================== */

app.options('*', cors()); // 👈 VERY IMPORTANT

/* ==============================
   MIDDLEWARE
============================== */

app.use(express.json());
app.use(morgan('dev'));

/* ==============================
   HEALTH CHECK
============================== */

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

/* ==============================
   ROUTES
============================== */

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/search', searchRoutes);

/* ==============================
   404 HANDLER
============================== */

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

/* ==============================
   GLOBAL ERROR HANDLER
============================== */

app.use(errorHandler);

module.exports = app;