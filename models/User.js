const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },

  email: {
    type: String,
    unique: true,
    required: function () {
      return !this.googleId && !this.githubId;
    },
  },

  password: {
    type: String,
    required: function () {
      return !this.googleId && !this.githubId;
    },
  },

  googleId: { type: String },
  githubId: { type: String },

  avatar: { type: String }, // stores profile picture URL

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
