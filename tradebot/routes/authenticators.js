require('dotenv').config();

const express = require('express');
const passport = require('passport');

const User = require('../models/user');

const FacebookStrategy = require('passport-facebook').Strategy;

let router = express.Router();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, user);
});

passport.use(new FacebookStrategy(
  {
    clientID: process.env.AUTH_FACEBOOK_CLIENT_ID,
    clientSecret: process.env.AUTH_FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.AUTH_FACEBOOK_CALLBACK_URL,
    profileFields: ['email', 'name']
  },
  (accessToken, refreshToken, profile, done) => {
    const { email, first_name, last_name } = profile._json;
  }
));

router.get('/authenticators/google', passport.authenticate('google'));
router.get(
  '/authenticators/google/cb',
  passport.authenticate(
    'google',
    { failureRedirect: '/authentication/authenticators/google', session: false },
    (req, res) => {
      console.log('successfully authenticated user: ', req.user);
      res.json(req.user);
    }
  ));

router.get('/authenticated', (req, res) => {
});

module.exports = router;
