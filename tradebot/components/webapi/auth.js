const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../database/postgres');
const User = require('../database/user');
const ApiKey = require('../database/apikeys');
const config = require('../database/configuration');

passport.serializeUser((auth, done) => {
});

passport.deserializeUser((keyid, done) => {
});

passport.use('apikey-local', new LocalStrategy(
  {
    usernameField: 'apikey',
    passwordField: 'secret',
  },
  async (apikey, secret, done) => {
    const key = await ApiKey.authenticate(apikey, secret);
    if (!key.status) {
      return done(key.error || key.message || 'unknown error');
    }
    return done(null, { type: 'apikey', keyid: key.keyid, userid: key.parentid, scopes: key.scopes, });
  }
));

passport.use('user-local', new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
  },
  async (username, password, done) => {
    const user = await User.authenticate(username, password);
    if (!user.status) {
      return done(user.error || user.message || 'unknown authentication error');
    }
    return done(null, { type: 'user', keyid: null, userid: user.id, scopes: null, });
  }
));

let router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    if (!req.body.password || !req.body.username || !req.body.email) {
      res.status(400).json({
        status: false,
        reason: 'password or username or email was not provided',
      });

      return;
    }

    const u = await User.create({
      username: req.body.username.toLowerCase(),
      email: req.body.email.toLowerCase(),
      password: req.body.password,
      fname: req.body.fname,
      lname: req.body.lname,
      role: 'user',
      active: true,
    });

    if (!u.status)
      return res.status(400).json({
        status: false,
        reason: u.reason || 'unknown error',
      });
    return res.status(200).json({
      status: true,
      username: req.body.username.toLowerCase(),
      email: req.body.email.toLowerCase(),
    });
  } catch(err) {
    res.status(500).json({
      status: false,
      reason: err.message || 'unknown error',
    });
  }
});

router.post('/login/api', (req, res, next) => {
  passport.authenticate('apikey-local', (err, user, info) => {
    if (err) { return next(err); };
    req.logIn(user, err => { if (err) return next(err); });
  })(req, res, next);
});

router.post('/login/user', (req, res, next) => {
  passport.authenticate('user-local', (err, user, info) => {
    if (err) { return next(err); };
    req.logIn(user, err => { if (err) return next(err); });
  })(req, res, next);
});

module.exports = { router };

// create an admin user
(async () => {
  await Promise.all([
    User.ready,
    config.ready,
  ]);

  const username = (await config.get('root.username', process.env.DEFAULT_ADMIN_USERNAME || 'root')).val;
  const existingUser = await User.find(null, username, null);

  if (existingUser.length !== 0)
    return;
  
  const u = await User.create({
    username: username,
    password: process.env.DEFAULT_ADMIN_PASSWORD || 'password',
    email: 'tradebot-admin@localhost',
    fname: 'administrative',
    lname: 'user',
    role: 'root',
  });

  console.info('The admin user was created. The credentials are: ', {
    username: username,
    password: process.env.DEFAULT_ADMIN_PASSWORD || 'password',
  });
})();
