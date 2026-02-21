const mongoose = require('mongoose');
const { mongoUri } = require('./env');

let connectPromise = null;

async function connectDb() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectPromise) {
    connectPromise = mongoose.connect(mongoUri).catch((error) => {
      connectPromise = null;
      throw error;
    });
  }

  await connectPromise;
  return mongoose.connection;
}

module.exports = { connectDb };
