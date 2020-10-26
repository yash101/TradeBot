const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const express = require('express');

const db = require('../database/postgres');

let dbconn = (async () => {
  // create database tables
  let connection = await db.connect();

  // auth data: each auth data links to a user
  await db.query(`
    CREATE TABLE IF NOT EXISTS "auth" (
      username    TEXT    PRIMARY KEY   NOT NULL,
      secret      TEXT                  NOT NULL,
      parent_id   BIGINT
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS "user" (
      userid      BIGSERIAL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      username    TEXT                  NOT NULL,
      email       TEXT                  NOT NULL,
    );
  `);

  /**
   * client_id is the "username"
   */
  await db.query(`
    CREATE TABLE IF NOT EXISTS "authentication" (
      user_id     SERIAL        PRIMARY KEY   GENERATED ALWAYS AS IDENTITY,
      client_id   TEXT          UNIQUE        NOT NULL,
      parent_clid TEXT                        DEFAULT NULL,
      CONSTRAINT fk_cliid FOREIGN KEY (client_id) REFERENCES keybase(client_id)
    );
  `);

  

  const findUser = async () => {
  };

  passport.use(new LocalStrategy(async (username, password, done) => {
    // check if username is 
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((user, done) => {
  });

  connection.release();

  return null;
})();

let router = (async () => {
  let authRouter = express.Router();

  authRouter.post('/signup', (req, res, next) => {
  });
})();
