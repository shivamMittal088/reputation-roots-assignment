const express = require('express');
const { body, param, query } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const Product = require('../models/Product');
const User = require('../models/User');

const router = express.Router();

router.get('/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('page must be >= 1'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('limit must be 1-50'),
    validate
  ],
  async (req, res, next) => {
    try {
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 8);
      const skip = (page - 1) * limit;
      const q = (req.query.q || '').trim();

      const filter = q
        ? {
            $or: [
              { title: { $regex: q, $options: 'i' } },
              { description: { $regex: q, $options: 'i' } }
            ]
          }
        : {};

      const [items, total] = await Promise.all([
        Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Product.countDocuments(filter)
      ]);

      return res.json({
        data: items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      return next(error);
    }
  }
);

router.get('/favorites', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('favorites');
    const favoriteIds = user?.favorites || [];

    if (!favoriteIds.length) {
      return res.json({ data: [], count: 0 });
    }

    const products = await Product.find({ _id: { $in: favoriteIds } }).sort({ createdAt: -1 });
    return res.json({ data: products, count: products.length });
  } catch (error) {
    return next(error);
  }
});

router.get('/mine/favorites', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('favorites');
    const favoriteIds = user?.favorites || [];

    if (!favoriteIds.length) {
      return res.json({ data: [], count: 0 });
    }

    const products = await Product.find({ _id: { $in: favoriteIds } }).sort({ createdAt: -1 });
    return res.json({ data: products, count: products.length });
  } catch (error) {
    return next(error);
  }
});

router.delete('/favorites', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.favorites = [];
    await user.save();
    return res.json({ favorites: [] });
  } catch (error) {
    return next(error);
  }
});

router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid product ID'), validate],
  async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.json(product);
    } catch (error) {
      return next(error);
    }
  }
);

router.post(
  '/',
  auth,
  [
    body('title').isLength({ min: 2 }).withMessage('Title must be at least 2 characters'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be >= 0'),
    body('description').isLength({ min: 3 }).withMessage('Description must be at least 3 characters'),
    body('image').isURL().withMessage('Image must be a valid URL'),
    body('images').optional().isArray({ min: 0, max: 4 }).withMessage('images must be an array with up to 4 URLs'),
    body('images.*').optional().isURL().withMessage('Each image must be a valid URL'),
    validate
  ],
  async (req, res, next) => {
    try {
      const product = await Product.create(req.body);
      return res.status(201).json(product);
    } catch (error) {
      return next(error);
    }
  }
);

router.put(
  '/:id',
  auth,
  [
    param('id').isMongoId().withMessage('Invalid product ID'),
    body('title').isLength({ min: 2 }).withMessage('Title must be at least 2 characters'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be >= 0'),
    body('description').isLength({ min: 3 }).withMessage('Description must be at least 3 characters'),
    body('image').isURL().withMessage('Image must be a valid URL'),
    body('images').optional().isArray({ min: 0, max: 4 }).withMessage('images must be an array with up to 4 URLs'),
    body('images.*').optional().isURL().withMessage('Each image must be a valid URL'),
    validate
  ],
  async (req, res, next) => {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      return res.json(product);
    } catch (error) {
      return next(error);
    }
  }
);

router.delete(
  '/:id',
  auth,
  [param('id').isMongoId().withMessage('Invalid product ID'), validate],
  async (req, res, next) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
);

router.post(
  '/:id/favorite',
  auth,
  [param('id').isMongoId().withMessage('Invalid product ID'), validate],
  async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const user = await User.findById(req.user.id);
      const productId = product._id.toString();

      if (!user.favorites.some((fav) => fav.toString() === productId)) {
        user.favorites.push(product._id);
        await user.save();
      }

      return res.json({ favorites: user.favorites });
    } catch (error) {
      return next(error);
    }
  }
);

router.delete(
  '/:id/favorite',
  auth,
  [param('id').isMongoId().withMessage('Invalid product ID'), validate],
  async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      const beforeCount = user.favorites.length;
      user.favorites = user.favorites.filter((fav) => fav.toString() !== req.params.id);

      if (user.favorites.length === beforeCount) {
        return res.status(404).json({ message: 'Favorite not found for user' });
      }

      await user.save();
      return res.json({ favorites: user.favorites });
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;
