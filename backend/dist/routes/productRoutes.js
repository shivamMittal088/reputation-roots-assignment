"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const { body, param, query } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const productController = require('../controllers/productController');
const router = express.Router();
router.get('/', [
    query('page').optional().isInt({ min: 1 }).withMessage('page must be >= 1'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('limit must be 1-50'),
    validate
], productController.listProducts);
router.get('/favorites', auth, productController.getFavorites);
router.get('/:id', [param('id').isMongoId().withMessage('Invalid product ID'), validate], productController.getProductById);
router.post('/', auth, [
    body('title').isLength({ min: 2 }).withMessage('Title must be at least 2 characters'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be >= 0'),
    body('description').isLength({ min: 3 }).withMessage('Description must be at least 3 characters'),
    body('image').isURL().withMessage('Image must be a valid URL'),
    validate
], productController.createProduct);
router.put('/:id', auth, [
    param('id').isMongoId().withMessage('Invalid product ID'),
    body('title').isLength({ min: 2 }).withMessage('Title must be at least 2 characters'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be >= 0'),
    body('description').isLength({ min: 3 }).withMessage('Description must be at least 3 characters'),
    body('image').isURL().withMessage('Image must be a valid URL'),
    validate
], productController.updateProduct);
router.delete('/:id', auth, [param('id').isMongoId().withMessage('Invalid product ID'), validate], productController.deleteProduct);
router.post('/:id/favorite', auth, [param('id').isMongoId().withMessage('Invalid product ID'), validate], productController.addFavorite);
router.delete('/:id/favorite', auth, [param('id').isMongoId().withMessage('Invalid product ID'), validate], productController.removeFavorite);
module.exports = router;
