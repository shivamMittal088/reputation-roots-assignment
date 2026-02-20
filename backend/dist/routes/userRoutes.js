"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');
const router = express.Router();
router.get('/me', auth, userController.getMe);
module.exports = router;
