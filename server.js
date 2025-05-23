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

// Login route (checks password and returns success message)
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

    res.status(200).json({ message: 'Login successful!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
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
