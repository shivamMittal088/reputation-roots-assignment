const app = require('../src/app');
const { connectDb } = require('../src/config/db');

module.exports = async (req, res) => {
  try {
    await connectDb();
    return app(req, res);
  } catch (error) {
    console.error('Function invocation failed', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
