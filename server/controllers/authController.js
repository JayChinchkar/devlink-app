const jwt = require('jsonwebtoken');

exports.githubCallback = (req, res) => {
  // Passport attaches the user to req.user
  const user = req.user;

  // Create a JWT token - ADDING AVATAR HERE
  const token = jwt.sign(
    { 
      id: user._id, 
      username: user.username,
      avatar: user.avatar // <--- CRITICAL FIX: Add this line
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Redirect to frontend with the token in the URL
  res.redirect(`http://localhost:5173?token=${token}`);
};