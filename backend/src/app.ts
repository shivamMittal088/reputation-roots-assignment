const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const searchRoutes = require('./routes/searchRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 204,
  maxAge: 86400
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
   if (req.method === 'OPTIONS') {
      return cors(corsOptions)(req, res, () => res.sendStatus(204));
   }

   return next();
});
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