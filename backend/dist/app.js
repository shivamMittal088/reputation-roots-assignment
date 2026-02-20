"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
app.use(errorHandler);
module.exports = app;
