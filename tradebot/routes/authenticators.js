const express = require('express');
const passport = require('passport');
const User = require('../models/user');

const GoogleAuthenticationStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleAuthenticationStrategy({
  clientID: AUTH_GOOGLE_CLIENT_ENV,
  clientSecret: AUTH_GOOGLE_CLIENT_SECRET,
  callbackURL: AUTH_GOOGLE_CBURL
}, (accessToken, refreshToken, profile, cb) => {
  User.findOne({ googleId: profile.id }, (err, person) => {
    
  });

  User.findOrCreate({ googleId: profile.id }, (err, user) => {
    return cb(err, user);
  });
}));

let router = express.Router();

router.get('/authenticators/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/authenticators/google/cb', passport.authenticate('google', { failureRedirect: '' }), (req, res => {
  res.send({success: true, message: 'authentication successful'});
}));

router.get('/authenticated', (req, res) => {
});

module.exports = router;
