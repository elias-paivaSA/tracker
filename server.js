require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');          // Enable CORS
const bcrypt = require('bcrypt');      // Password hashing
const jwt = require('jsonwebtoken');  // JWT generation
const User = require('./models/User'); // Your User model

const app = express();

app.use(cors());                      // Allow all origins (adjust if needed)
app.use(express.json());              // Parse JSON request bodies

// Middleware to verify JWT token for protected routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access denied, token missing!' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// Signup route with password hashing + JWT token creation
app.post('/auth/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Generate JWT token after signup
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token // send token to frontend
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login route with JWT token creation
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token after successful login
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful!',
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Protected route example
app.get('/dashboard', authenticateToken, (req, res) => {
  res.json({ message: `Welcome to your dashboard, ${req.user.email}!` });
});

// Simple test route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Connect to MongoDB using connection string in .env file
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
