const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const db = require('../database/postgres');

module(async () => {
  // create database tables
  let connection = await db.connect();

  await db.query(`
    CREATE TABLE IF NOT EXISTS "keybase" (
      client_id SERIAL        PRIMARY KEY   GENERATED ALWAYS AS IDENTITY,
      user_id   INT,
      secret    TEXT                        NOT NULL,
      salt      TEXT                        NOT NULL,
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS "user" (
      user_id   SERIAL        PRIMARY KEY   GENERATED ALWAYS AS IDENTITY,
      client_id INT           UNIQUE,  
      email     TEXT          UNIQUE,
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
})();
