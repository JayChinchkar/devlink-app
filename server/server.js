require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const passport = require('passport');
require('./config/passport'); 

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
console.log("DEBUG: Current CALLBACK_URL is set to:", "https://devlink-dbsj.onrender.com/api/auth/github/callback");

const app = express();

// 1. CONNECT DATABASE
connectDB();

// 2. MIDDLEWARE
// DYNAMIC CORS: Allow both localhost and your live Vercel URL
const allowedOrigins = [
  'http://localhost:5173',
  'https://devlink-peach.vercel.app' 
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(passport.initialize());

// 3. ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// 4. BASE ROUTE
app.get('/', (req, res) => {
  res.send('DevLink API is running...');
});

// 5. START SERVER
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`-------------------------------------------`);
  console.log(`🚀 Server running on Port: ${PORT}`);
  console.log(`✅ CORS configured for Production & Local`);
  console.log(`-------------------------------------------`);
});