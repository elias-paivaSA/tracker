const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },   // User's name
  email: { type: String, required: true, unique: true },  // User's email (must be unique)
  password: { type: String, required: true }    // User's password (stored as plain text for now)
});

const User = mongoose.model('User', userSchema);

module.exports = User;