const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const express = require('express');

const db = require('../database/postgres');


class User {
  constructor() {
    this.userid = null;
    this.username = null;
    this.email = null;
    this.authKeys = null;
  }
};

let router = express.Router();

router.post('/signup', (req, res, next) => {
});

module.exports = { router, authenticate };
