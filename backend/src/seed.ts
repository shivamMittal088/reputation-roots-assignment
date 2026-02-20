const bcrypt = require('bcryptjs');
const { connectDb } = require('./config/db');
const Product = require('./models/Product');
const User = require('./models/User');

const products = [
  {
    title: 'Vintage Leather Journal',
    price: 24.99,
    description: 'Hand-stitched leather journal for notes, sketches, and ideas.',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1470790376778-a9fbc86d70e2?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    title: 'Minimal Desk Lamp',
    price: 39.5,
    description: 'Soft warm LED desk lamp with adjustable arm and matte finish.',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    title: 'Ceramic Coffee Mug Set',
    price: 32.0,
    description: 'Set of two handcrafted ceramic mugs with smooth glaze.',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    title: 'Noise-Isolating Headphones',
    price: 89.99,
    description: 'Over-ear headphones with rich audio and long battery life.',
    image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1524678714210-9917a6c619c2?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    title: 'Eco Tote Bag',
    price: 18.75,
    description: 'Durable everyday tote made from recycled cotton canvas.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1524492449090-1e5d4f56b2bb?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1614179689702-355944cd0918?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    title: 'Smart Water Bottle',
    price: 45.0,
    description: 'Tracks hydration and glows gently to remind you to drink water.',
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1561112668-231f4d33d027?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1532634896-26909d0d4b6b?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    title: 'Portable Bluetooth Speaker',
    price: 59.0,
    description: 'Compact speaker with deep bass and IPX7 splash resistance.',
    image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    title: 'Fitness Resistance Bands',
    price: 21.49,
    description: 'Five-level resistance bands for home workouts and travel.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    title: 'Aromatherapy Candle Trio',
    price: 27.95,
    description: 'Soy wax candles in lavender, cedar, and citrus scents.',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1602526219043-6ea6d2f4d885?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1612196808214-b7e239e5d0b9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1616627981459-63cb5f7c8d7e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1603204077779-bed963ea7f76?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    title: 'Wireless Charging Pad',
    price: 29.0,
    description: 'Fast wireless charging pad with non-slip finish and USB-C.',
    image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1616578273460-7f6f0e105f42?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=80'
    ]
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

  const hashedUsers = await Promise.all(
    users.map(async (user, index) => ({
      name: user.name,
      email: user.email,
      passwordHash: await bcrypt.hash(user.password, 10),
      favorites: index === 1 ? [insertedProducts[0]._id, insertedProducts[1]._id] : []
    }))
  );

  await User.insertMany(hashedUsers);

  console.log('Seed completed: 10 products, 2 users created.');
  process.exit(0);
}

runSeed().catch((error) => {
  console.error('Seed failed', error);
  process.exit(1);
});
