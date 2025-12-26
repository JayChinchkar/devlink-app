const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/github/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // 1. Look for user in our DB
      let user = await User.findOne({ githubId: profile.id });

      if (!user) {
        // 2. Create new user if not found
        user = await User.create({
          githubId: profile.id,
          username: profile.username,
          avatar: profile._json.avatar_url, // Get avatar from GitHub JSON
          bio: profile._json.bio
        });
      } else {
        // 3. IMPORTANT: Update existing user's avatar/bio in case it changed on GitHub
        user.avatar = profile._json.avatar_url;
        user.bio = profile._json.bio;
        await user.save();
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));