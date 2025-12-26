require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const passport = require('passport');
require('./config/passport'); // Initialize passport strategy

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();

// 1. CONNECT DATABASE
connectDB();

// 2. MIDDLEWARE (Must come BEFORE Routes)
// Improved CORS to allow requests from your Vite frontend
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // Allows the server to read JSON data in req.body
app.use(passport.initialize());

// 3. ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// 4. BASE ROUTE
app.get('/', (req, res) => {
  res.send('DevLink API is running...');
});

// 5. START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`-------------------------------------------`);
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`✅ CORS enabled for: http://localhost:5173`);
  console.log(`-------------------------------------------`);
});