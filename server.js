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
const GitHubStrategy = require('passport-github2').Strategy;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      const existingEmailUser = await User.findOne({ email: profile.emails[0].value });
      if (existingEmailUser) {
        existingEmailUser.googleId = profile.id;
        existingEmailUser.avatar = profile.photos?.[0]?.value || existingEmailUser.avatar;
        await existingEmailUser.save();
        return done(null, existingEmailUser);
      }

      user = new User({
        username: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        avatar: profile.photos?.[0]?.value,
        password: undefined,
      });

      await user.save();
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// GitHub Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "/auth/github/callback",
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ githubId: profile.id });

    if (!user) {
      const email = profile.emails?.[0]?.value;
      const existingEmailUser = email ? await User.findOne({ email }) : null;

      if (existingEmailUser) {
        existingEmailUser.githubId = profile.id;
        existingEmailUser.avatar = profile.photos?.[0]?.value || existingEmailUser.avatar;
        await existingEmailUser.save();
        return done(null, existingEmailUser);
      }

      user = new User({
        username: profile.username || profile.displayName,
        email: email || null,
        githubId: profile.id,
        avatar: profile.photos?.[0]?.value,
        password: undefined,
      });

      await user.save();
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// Google Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`/dashboard.html?token=${token}`);
  }
);

// GitHub Routes
app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`/dashboard.html?token=${token}`);
  }
);

// Static routes
app.get('/', (req, res) => res.send('Hello World'));
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'dashboard.html'));
});

// Signup
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
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(201).json({ token });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.password) {
      return res.status(403).json({ message: 'This account uses OAuth login. Use Google or GitHub.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Connect and run
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
