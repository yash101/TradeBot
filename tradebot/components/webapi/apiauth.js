const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const express = require('express');

const db = require('../database/postgres');
const User = require('../database/users');

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
    const ret = User.newUser({
      username: req.body.username,
      email: req.body.email,
      role: 'user',
      fname: req.body.fname || null,
      lname: req.body.lname || null,
      password: req.body.password,
    });

    res.json(ret, ret.status ? 200 : 400);
  } catch(err) {
    res.send(err.message);
  }
});

module.exports = { router };
