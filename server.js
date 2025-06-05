require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const User = require('./models/User');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from 'src'
app.use(express.static(path.join(__dirname, 'src')));

// Session setup (needed for passport)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport serialize/deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      // Check if email already exists (local user with same email)
      const existingEmailUser = await User.findOne({ email: profile.emails[0].value });
      if (existingEmailUser) {
        // Attach googleId to existing user (optional, you can also reject)
        existingEmailUser.googleId = profile.id;
        await existingEmailUser.save();
        return done(null, existingEmailUser);
      }
      // Create new user with google info, no password
      user = new User({
        username: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        password: undefined, // no password because OAuth user
      });
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// Routes

// Google OAuth login
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Create JWT for logged-in user
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Redirect with token (adjust front-end URL accordingly)
    res.redirect(`/dashboard.html?token=${token}`);
  }
);

// Basic root route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Serve dashboard.html explicitly
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'dashboard.html'));
});

// Signup route
app.post('/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Connect to DB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
