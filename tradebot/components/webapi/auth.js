const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const express = require('express');

const db = require('../database/postgres');
const User = require('../database/user');

passport.serializeUser((auth, done) => {
});

passport.deserializeUser((keyid, done) => {
});

passport.use(new LocalStrategy(
));

let router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    if (!req.body.password || !req.body.username || !req.body.email) {
      res.status(400).json({
        status: 'failure',
        reason: 'password or username or email was not provided',
      });

      return;
    }



    if (!ret.status)
      res.status(400).json({
        status: 'failure',
        reason: ret.reason,
      });
  } catch(err) {
    res.status(500).json({
      status: 'failure',
      reason: err.message,
    });
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const clientid = req.body.clientid;
    const lowercliid = clientid.toLowerCase();
    const secret = req.body.secret;

    let key = await User.authenticate(clientid, secret);
    if (!key.status)
      key = await User.authenticate(lowercliid, secret);
    
    if (!key.status) {
      res.status(401).json({
        status: 'failure',
        reason: 'authentication failed',
      });

      return;
    }

    next();
  } catch(err) {
  }
}, passport.authenticate('login'));


module.exports = { router };

// create an admin user
(async () => {
  await User.ready;
  const u = await User.findUser({ username: 'admin' });
  if (!u.data || u.data.length === 0) {
    const createUser = await User.newUser({
      username: 'admin',
      password: 'admin',
      fname: 'admin',
      lname: 'admin',
      role: 'admin',
      email: 'tradebot-admin@localhost',
    });

    if (!createUser.status) {
      console.error('Failed to create default administrator user');
      console.error('Reason: ', createUser.reason);
      if (createUser.error)
        console.error(createUser.error);
      process.exit(-1);
    }

    console.info('Default administrative user was created: ', {
      username: 'admin',
      password: 'admin'
    });
  }
})();
