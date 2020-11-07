const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const express = require('express');

const db = require('../database/postgres');
const User = require('../database/users');
const { catch } = require('./webapi');

passport.serializeUser((auth, done) => {
  done(null, auth.keyid);
});

passport.deserializeUser((keyid, done) => {
  User.findUserByKeyId(keyid)
  .then(res => {
    if (!res.status) {
      done(res.status, null);
    } else {
      done(null, res.data);
    }
  })
  .catch(err => {
    done(err, null);
  });
});

passport.use(new LocalStrategy(
  {},
  (clientid, secret, done) => {
    // check if the auth key exists
    User.authenticate(clientid, secret)
    .then(data => {
      if (data.status) {
        return done(null, data.data);
      } else {
        return done(data.reason, null);
      }
    })
    .catch(err => { return done(err); })
  }
))

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

    const ret = await User.newUser({
      username: req.body.username.toLowerCase(),
      email: req.body.email.toLowerCase(),
      role: 'user',
      fname: req.body.fname || null,
      lname: req.body.lname || null,
      password: req.body.password,
    });

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

    
  } catch(err) {
  }
})


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
