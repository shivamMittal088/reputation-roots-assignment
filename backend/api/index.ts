module.exports = async (req, res) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    const app = require('../src/app');
    const { connectDb } = require('../src/config/db');

    if ((req.url || '').split('?')[0] === '/health') {
      return app(req, res);
    }

    await connectDb();
    return app(req, res);
  } catch (error) {
    console.error('Function invocation failed', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
