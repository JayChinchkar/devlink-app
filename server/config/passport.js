const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

// Force the callback URL to be exactly what GitHub expects
const CALLBACK_URL = "https://devlink-dbsj.onrender.com/api/auth/github/callback";

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Logic to find or create the user
      let user = await User.findOne({ githubId: profile.id });

      if (!user) {
        user = await User.create({
          githubId: profile.id,
          username: profile.username,
          avatar: profile._json.avatar_url,
          bio: profile._json.bio
        });
      } else {
        // Update profile data in case it changed on GitHub
        user.avatar = profile._json.avatar_url;
        user.bio = profile._json.bio;
        await user.save();
      }
      
      return done(null, user);
    } catch (err) {
      console.error("❌ Passport Strategy Error:", err);
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Log to Render console on startup to verify the code updated
console.log(`✅ Passport GitHub Strategy initialized with callback: ${CALLBACK_URL}`);