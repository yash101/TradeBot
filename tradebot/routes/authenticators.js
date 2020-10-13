const express = require('express');
const passport = require('passport');
const User = require('../models/user');

const GoogleAuthenticationStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
dotenv.config();

passport.use(new GoogleAuthenticationStrategy({
  clientID: process.env.AUTH_GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET || '',
  callbackURL: process.env.AUTH_GOOGLE_CBURL || ''
}, (accessToken, refreshToken, profile, cb) => {
  User.findOne({ googleId: profile.id }, (err, person) => {
    
  });

  User.findOrCreate({ googleId: profile.id }, (err, user) => {
    return cb(err, user);
  });
}));

let router = express.Router();

//router.get('/authenticators/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/authenticators/google/cb', passport.authenticate('google', { failureRedirect: '' }), (req, res) => {
  res.send({success: true, message: 'authentication successful'});
});

router.get('/authenticated', (req, res) => {
});

module.exports = router;
