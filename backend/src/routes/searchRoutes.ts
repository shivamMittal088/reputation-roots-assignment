const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

const MAX_RECENT_SEARCHES = 8;

router.get('/recent-searches', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('recentSearches');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ recentSearches: user.recentSearches || [] });
  } catch (error) {
    return next(error);
  }
});

router.post('/recent-searches', auth, async (req, res, next) => {
  try {
    const { term } = req.body;
    const normalizedTerm = (term || '').trim();

    if (!normalizedTerm) {
      return res.status(400).json({ message: 'Search term is required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const deduped = (user.recentSearches || []).filter(
      (item) => item.toLowerCase() !== normalizedTerm.toLowerCase()
    );
    user.recentSearches = [normalizedTerm, ...deduped].slice(0, MAX_RECENT_SEARCHES);
    await user.save();

    return res.json({ recentSearches: user.recentSearches });
  } catch (error) {
    return next(error);
  }
});

router.delete('/recent-searches', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.recentSearches = [];
    await user.save();

    return res.json({ recentSearches: [] });
  } catch (error) {
    return next(error);
  }
});

router.delete('/recent-searches/:term', auth, async (req, res, next) => {
  try {
    const { term } = req.params;
    const normalizedTerm = decodeURIComponent(term || '').trim();

    if (!normalizedTerm) {
      return res.status(400).json({ message: 'Search term is required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.recentSearches = (user.recentSearches || []).filter(
      (item) => item.toLowerCase() !== normalizedTerm.toLowerCase()
    );
    await user.save();

    return res.json({ recentSearches: user.recentSearches });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
