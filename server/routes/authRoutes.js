const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authController');

// @desc    Auth with GitHub
// @route   GET /api/auth/github
// ADDED { session: false } HERE
router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }));

// @desc    GitHub auth callback
// @route   GET /api/auth/github/callback
// ADDED { session: false } HERE AS WELL
router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/', session: false }),
  authController.githubCallback
);

module.exports = router;