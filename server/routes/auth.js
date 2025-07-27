const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// === SIGN UP ===
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, interests, location } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      interests,
      location,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '7d' });  // updated this to add email: newUser.email (need this for payments)
    res.status(201).json({ token, user: { id: newUser._id, username: newUser.username, email: newUser.email } });  // updated this to add email: newUser.email (need this for payments)
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Something went wrong during signup' });
  }
});

// === LOGIN ===
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });  // updated this as well to add email:user.email (need this for payments as well)
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });  // updated this to add email:user.email (need this for payments)
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong during login' });
  }
});

// === GOOGLE LOGIN ===
router.post('/google-login', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Find or create the user in your DB
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, username: name, profilePic: picture });
    }

    // Generate your own JWT
    const yourToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);  // updated this to add email:user.email (need this for payments)

    res.json({ token: yourToken, user: { id: user._id, username: user.username, email: user.email } });  // updated this to add email:user.email (need this for payments)
  } catch (err) {
    console.error('Google login failed:', err);
    res.status(401).json({ message: 'Invalid Google token' });
  }
});

module.exports = router;
