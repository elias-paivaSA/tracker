require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User'); // Import the User model

const app = express();

app.use(express.json()); // Parse JSON bodies from requests

// Signup route
app.post('/auth/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
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