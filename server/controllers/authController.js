const jwt = require('jsonwebtoken');

exports.githubCallback = (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      console.error("❌ No user found in request");
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=auth_failed`);
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, avatar: user.avatar },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Explicitly check if the env var is being read
    const frontendUrl = process.env.FRONTEND_URL;
    
    if (!frontendUrl) {
      console.warn("⚠️ FRONTEND_URL env var is missing! Defaulting to localhost.");
    }

    const finalDestination = frontendUrl || 'http://localhost:5173';

    console.log(`🚀 Redirecting user ${user.username} to ${finalDestination}`);
    
    // Most SPA apps handle the token on the root route
    res.redirect(`${finalDestination}?token=${token}`);

  } catch (err) {
    console.error("Auth Controller Error:", err);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=server_error`);
  }
};