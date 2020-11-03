const db = require('./postgres');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

class User {
  constructor() {
    this.ready = async () => {
      return db.query(`
        --- userid, username, email, name, role created
        CREATE TABLE "user" (
          id        BIGINT      GENERATED ALWAYS AS IDENTITY,
          username  TEXT        NOT NULL,
          email     TEXT,
          fname     TEXT,
          lname     TEXT,
          role      TEXT,
          created   TIMESTAMPTZ NOT NULL  DEFAULT current_timestamp
        );

        CREATE TABLE "auth_keys" (
          keyid     BIGINT      GENERATED ALWAYS AS IDENTITY,
          parentid  BIGINT      NOT NULL,
          clientid  TEXT,
          secret    TEXT,
          created   TIMESTAMPTZ NOT NULL  DEFAULT current_timestamp,
          lastlogin TIMESTAMPTZ           DEFAULT NULL,
          CONSTRAINT fk_parentid  FOREIGN KEY clientid REFERENCES user(id)
        );
      `);
    };
  }
}
