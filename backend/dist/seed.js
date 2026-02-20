"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require('bcryptjs');
const { connectDb } = require('./config/db');
const Product = require('./models/Product');
const User = require('./models/User');
const products = [
    {
        title: 'Vintage Leather Journal',
        price: 24.99,
        description: 'Hand-stitched leather journal for notes, sketches, and ideas.',
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80'
    },
    {
        title: 'Minimal Desk Lamp',
        price: 39.5,
        description: 'Soft warm LED desk lamp with adjustable arm and matte finish.',
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'
    },
    {
        title: 'Ceramic Coffee Mug Set',
        price: 32.0,
        description: 'Set of two handcrafted ceramic mugs with smooth glaze.',
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80'
    },
    {
        title: 'Noise-Isolating Headphones',
        price: 89.99,
        description: 'Over-ear headphones with rich audio and long battery life.',
        image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=900&q=80'
    },
    {
        title: 'Eco Tote Bag',
        price: 18.75,
        description: 'Durable everyday tote made from recycled cotton canvas.',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80'
    },
    {
        title: 'Smart Water Bottle',
        price: 45.0,
        description: 'Tracks hydration and glows gently to remind you to drink water.',
        image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=900&q=80'
    },
    {
        title: 'Portable Bluetooth Speaker',
        price: 59.0,
        description: 'Compact speaker with deep bass and IPX7 splash resistance.',
        image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=900&q=80'
    },
    {
        title: 'Fitness Resistance Bands',
        price: 21.49,
        description: 'Five-level resistance bands for home workouts and travel.',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80'
    },
    {
        title: 'Aromatherapy Candle Trio',
        price: 27.95,
        description: 'Soy wax candles in lavender, cedar, and citrus scents.',
        image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=80'
    },
    {
        title: 'Wireless Charging Pad',
        price: 29.0,
        description: 'Fast wireless charging pad with non-slip finish and USB-C.',
        image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=900&q=80'
    }
];
const users = [
    {
        name: 'Demo Seller',
        email: 'seller@example.com',
        password: 'password123'
    },
    {
        name: 'Demo Buyer',
        email: 'buyer@example.com',
        password: 'password123'
    }
];
async function runSeed() {
    await connectDb();
    await Promise.all([Product.deleteMany({}), User.deleteMany({})]);
    const insertedProducts = await Product.insertMany(products);
    const hashedUsers = await Promise.all(users.map(async (user, index) => ({
        name: user.name,
        email: user.email,
        passwordHash: await bcrypt.hash(user.password, 10),
        favorites: index === 1 ? [insertedProducts[0]._id, insertedProducts[1]._id] : []
    })));
    await User.insertMany(hashedUsers);
    console.log('Seed completed: 10 products, 2 users created.');
    process.exit(0);
}
runSeed().catch((error) => {
    console.error('Seed failed', error);
    process.exit(1);
});
