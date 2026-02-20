const mongoose = require('mongoose');
const { mongoUri } = require('./env');

async function connectDb() {
  await mongoose.connect(mongoUri);
}

module.exports = { connectDb };
