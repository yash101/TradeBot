const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../database/postgres');
const User = require('../database/user');
const ApiKey = require('../database/apikeys');
const config = require('../database/configuration');

passport.serializeUser((auth, done) => {
  done(null, auth);
});

passport.deserializeUser((auth, done) => {
  done(null, auth);
});

passport.use('apikey-local', new LocalStrategy(
  {
    usernameField: 'apikey',
    passwordField: 'secret',
    session: true,
  },
  async (apikey, secret, done) => {
    // compelte: get the userid and scopes
    ApiKey.authenticate(apikey, secret).then(key => {
      return (key.status) ?
        done(null, { type: 'apikey', keyid: apikey, userid: key.data.parentid, scopes: key.data.scopes, }) :
        done(key.reason, false);
    });
  }
));

passport.use('user-local', new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    session: true,
  },
  (username, password, done) => {
    User.authenticate(username, password).then(user => {
      return (user.status) ?
        done(null, { type: 'user', keyid: null, userid: user.data.id, scopes: null, }) :
        done(user.reason, false);
    });
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
      reason: err.reason || 'unknown error',
    });
  }
});

router.post(
  '/login/api',
  (req, res, next) => {
    passport.authenticate('apikey-local', (err, user, info) => {
      if (!err) {
        req.logIn(user, err => {
          return (err) ?
            res.status(401).json({ status: false, message: 'authentication failure', error: err, user: null, }) :
            res.status(200).json({ status: true, message: 'authentication successful', user: user, });
        });
      } else {
        return res.status(401).json({ status: false, message: 'authentication failure', error: null, user: null, });
      }
    })(req, res, next);
  }
);

router.post(
  '/login/user',
  (req, res, next) => {
    passport.authenticate('user-local', (err, user, info) => {
      if (!err) {
        req.logIn(user, error => {
          return (error) ?
            res.status(401).json({ status: false, message: 'authentication failure', error: error, user: null, }) :
            res.status(200).json({ status: true, message: 'authentication successful', user: user, });
        });
      } else {
        return res.status(401).json({ status: false, message: 'authentication failure', error: null, user: null, });
      }
    })(req, res, next);
  }
);

router.get('/is_authenticated', (req, res, next) => {
  return res.status(req.user ? 200 : 401)
  .json(
    (req.user) ?
      { status: true, } :
      { status: false, error: 'Not logged in', },
  );
});

router.get('/logout', (req, res, next) => {
  req.logOut();
  return res.status(200).json({ status: true });
});

// create a default root user
const rootUserReady = (async () => {
  await Promise.all([
    User.ready,
    config.ready,
  ]);

  const username = (await config.get('root.username', process.env.DEFAULT_ADMIN_USERNAME || 'root')).val;
  const existingUser = await User.find(null, username, null);

  if (!existingUser.status) {
    console.error('Failed to create root user');
    console.error(existingUser.error || existingUser.reason);
    process.exit(-1);
  }

  if (existingUser.data.length !== 0)
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

  return true;
})();

module.exports = { router, rootUserReady };
