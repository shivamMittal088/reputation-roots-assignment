"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret, jwtExpiresIn } = require('../config/env');
function signToken(userId) {
    return jwt.sign({ userId }, jwtSecret, { expiresIn: jwtExpiresIn });
}
async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email: email.toLowerCase(), passwordHash, favorites: [] });
        const token = signToken(user._id.toString());
        return res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                favorites: user.favorites
            }
        });
    }
    catch (error) {
        return next(error);
    }
}
async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = signToken(user._id.toString());
        return res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                favorites: user.favorites
            }
        });
    }
    catch (error) {
        return next(error);
    }
}
module.exports = {
    register,
    login
};
