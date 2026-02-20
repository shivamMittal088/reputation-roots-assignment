"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Product = require('../models/Product');
const User = require('../models/User');
async function listProducts(req, res, next) {
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
    }
    catch (error) {
        return next(error);
    }
}
async function getFavorites(req, res, next) {
    try {
        const user = await User.findById(req.user.id).select('favorites');
        const favoriteIds = user?.favorites || [];
        if (!favoriteIds.length) {
            return res.json({ data: [], count: 0 });
        }
        const products = await Product.find({ _id: { $in: favoriteIds } }).sort({ createdAt: -1 });
        return res.json({ data: products, count: products.length });
    }
    catch (error) {
        return next(error);
    }
}
async function getProductById(req, res, next) {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.json(product);
    }
    catch (error) {
        return next(error);
    }
}
async function createProduct(req, res, next) {
    try {
        const product = await Product.create(req.body);
        return res.status(201).json(product);
    }
    catch (error) {
        return next(error);
    }
}
async function updateProduct(req, res, next) {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.json(product);
    }
    catch (error) {
        return next(error);
    }
}
async function deleteProduct(req, res, next) {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(204).send();
    }
    catch (error) {
        return next(error);
    }
}
async function addFavorite(req, res, next) {
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
    }
    catch (error) {
        return next(error);
    }
}
async function removeFavorite(req, res, next) {
    try {
        const user = await User.findById(req.user.id);
        const beforeCount = user.favorites.length;
        user.favorites = user.favorites.filter((fav) => fav.toString() !== req.params.id);
        if (user.favorites.length === beforeCount) {
            return res.status(404).json({ message: 'Favorite not found for user' });
        }
        await user.save();
        return res.json({ favorites: user.favorites });
    }
    catch (error) {
        return next(error);
    }
}
module.exports = {
    listProducts,
    getFavorites,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    addFavorite,
    removeFavorite
};
