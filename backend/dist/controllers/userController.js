"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User = require('../models/User');
async function getMe(req, res, next) {
    try {
        const user = await User.findById(req.user.id).select('-passwordHash');
        return res.json(user);
    }
    catch (error) {
        return next(error);
    }
}
module.exports = {
    getMe
};
