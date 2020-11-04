const db = require('./postgres');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { catch, catch, catch, catch, catch } = require('../webapi/webapi');

class User {
  constructor() {
    this.ready = (async () => {
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
          clientid  TEXT        NOT NULL  UNIQUE,
          secret    TEXT,
          created   TIMESTAMPTZ NOT NULL  DEFAULT current_timestamp,
          lastlogin TIMESTAMPTZ           DEFAULT NULL,

          CONSTRAINT fk_parentid  FOREIGN KEY clientid REFERENCES user(id)
        );
      `).catch(err => {
        console.error(err);
        console.error('Unable to create user table');
        process.exit(-1);
      });
    })();
  }

  async authenticate(clientid, secret) {
    try {
      // find the auth key by the clientid
      const query = await db.query('SELECT * FROM "auth_keys" k WHERE k.clientid = $1;', [clientid]);

      // user was not found
      if (query.rowCount === 0) {
        return {
          status: false,
          reason: 'invalid client id',
        };
      }

      const realSecret = query.rows[0]['secret'];
      const match = await bcrypt.compare(secret, realSecret);

      if (match) {
        db.query('UPDATE "auth_keys" k SET lastlogin = NOW() WHERE keyid = $1;', query.rows[0].keyid);
        return {
          status: true,
          data: query.rows[0],
        };
      } else {
        return {
          status: false,
          reason: 'secret did not match',
        }
      }
    } catch(err) {
      console.error(err);
      return {
        status: false,
        reason: 'exception was thrown',
        error: err,
      };
    }
  }

  async getAuthKeys(userid) {
    try {
      const query = await db.query('SELECT * FROM "auth_keys" k WHERE k.parentid = $1;', userid);
      return query.rows;
    } catch(err) {
      console.error(err);
      return [];
    }
  }

  async setPassword(clientid, secret) {
    try {
      const salt = crypto.randomBytes(128).toString('base64');
      const newPassword = await bcrypt.hash(secret, salt);

      const query = await db.query('UPDATE "auth_keys" SET secret = $2 WHERE clientid = $1 RETURNING *;', [clientid, secret]);

      if (query.rowCount === 0) {
        return {
          status: false,
          reason: 'failed to update password',
        };
      } else {
        return {
          status: true,
          data: query.rows[0],
        };
      }
    } catch(err) {
      console.error(err);
      return {
        status: false,
        reason: 'exception was thrown',
        error: err,
      };
    }
  }

  async findAuthKeyById(keyid) {
    try {
      const query = await db.query('SELECT * FROM "auth_keys" k WHERE k.keyid = $1;', [keyid]);

      return (query.rowCount !== 0) ?
        { status: true, data: query.rows[0], } :
        { status: false, reason: 'failed to find auth key by the provided id' };
    } catch(err) {
      console.error(err);
      return {
        status: false,
        reason: 'exception was thrown',
        error: err
      };
    }
  }

  async newAuthKey(userid, username, password) {
    try {
      const clientid = username || crypto.randomBytes(192).toString('base64');

      const hashed = await bcrypt.hash(
        password || crypto.randomBytes(192).toString('base64'),
        crypto.randomBytes(128).toString('base64')
      );

      const query = await db.query('INSERT INTO "auth_keys" (parentid, clientid, secret) VALUES ($1, $2, $3) RETURNING *;', [userid, clientid, hashed]);

      return query.rows[0];
    } catch(err) {
      console.error(err);
      return {
        status: false,
        reason: 'exception was thrown',
        error: err,
      };
    }
  }

  async deleteAuthKey(clientid) {
    try {
      const query = await db.query('DELETE FROM "auth_keys" WHERE clientid = $1 RETURNING *;', [clientid]);
      return (query.rowCount !== 0) ?
        { status: true, data: query.rows[0] } :
        { status: false, reason: 'no auth key was found with specified client id' };
    } catch(err) {
      console.error(err);
      return {
        status: false,
        reason: 'exception was thrown',
        error: err,
      };
    }
  }

  async getUserById(userid) {
    try {
      const query = await db.query('SELECT * FROM "user" u WHERE u.id = $1;', [userid]);
      
      return (query.rowCount !== 0) ?
        { status: true, data: query.rows[0], } :
        { status: false, reason: 'unable to find user by id', };
    } catch(err) {
      console.error(err);
      return {
        status: false,
        reason: 'exception was thrown',
        error: err,
      };
    }
  }

  async getUserByEmail(email) {
    try {
      const query = await db.query('SELECT * FROM "user" u WHERE u.email = $1;', [email]);
      
      return (query.rowCount !== 0) ?
        { status: true, data: query.rows[0], } :
        { status: false, reason: 'unable to find user by email', };
    } catch(err) {
      console.error(err);
      return {
        status: false,
        reason: 'exception was thrown',
        error: err,
      };
    }
  }

  async getUserByUsername(username) {
    try {
      const query = await db.query('SELECT * FROM "user" u WHERE u.username = $1;', [username]);
      
      return (query.rowCount !== 0) ?
        { status: true, data: query.rows[0], } :
        { status: false, reason: 'unable to find user by username', };
    } catch(err) {
      console.error(err);
      return {
        status: false,
        reason: 'exception was thrown',
        error: err,
      };
    }
  }

  async findUser(usernameOrEmail) {
    try {
      const searchUsername = await this.getUserByUsername(usernameOrEmail);

      return (searchUsername.status) ?
        searchUsername :
        this.getUserByEmail(usernameOrEmail);
    } catch(err) {
      console.error(err);
      return {
        status: false,
        reason: 'exception was thrown',
        error: err,
      };
    }
  }

  async newUser(data) {
    try {
      if (!data.email || !data.username) return { status: false, reason: 'email and username were not provided', };

      // check if the user already exists
      const checkUserQuery = await db.query('SELECT * FROM "user" WHERE username = $1 OR email = $2;');
      if (checkUserQuery.rowCount !== 0)
        return { status: false, reason: 'username or email already in use', };

      const query = await db.query('INSERT INTO "user" (username, email) VALUES ($1, $2) RETURNING *;', [data.username, data.email]);
      const row = query.rows[0];

      const q2 = await db.query(`
        BEGIN;
          UPDATE "user" SET role = $2 WHERE id = $1 AND $2 IS NOT NULL;
          UPDATE "user" SET fname = $3 WHERE id = $1 AND $3 IS NOT NULL;
          UPDATE "user" SET lname = $4 WHERE id = $1 AND $4 IS NOT NULL;
          SELECT * FROM "user" WHERE id = $1;
        COMMIT;
      `);

      return (q2.rowCount !== 0) ?
        { status: true, data: q2.rows[0], } :
        { status: false, reason: 'unknown failure adding user', };
    } catch(err) {
      console.error(err);
      return {
        status: false,
        reason: 'exception was thrown',
        error: err,
      };
    }
  }

  // needs the userid
  async updateUser(data) {
    await db.query(`
      BEGIN;
        UPDATE "user" SET email = $3 WHERE id = $1 AND $3 IS NOT NULL;
        UPDATE "user" SET fname = $4 WHERE id = $1 AND $4 IS NOT NULL;
        UPDATE "user" SET lname = $5 WHERE id = $1 AND $5 IS NOT NULL;
      COMMIT;
    `, [
      data.id || null,
      data.username || null,
      data.email || null,
      data.fname || null,
      data.lname || null,
      data.role || null
    ])
    .catch(err => {
      console.error(err);
      throw err;
    });
  };

  async findUserByKeyId(keyid) {
    try {
      const key = await this.findAuthKeyById(keyid);
      if (key.status) {
        const query = await db.query('SELECT * FROM "user" u WHERE u.id = $1', [key.data.parentid]);
        return (query.rowCount !== 0) ?
          { status: true, data: query.rows[0] } :
          { status: false, reason: 'unable to find user by id' };
      } else {
        return key;
      }
    } catch(err) {
      console.error(err);
      return {
        status: false,
        reason: 'exception was thrown',
        error: err,
      };
    }
  }
}

module.exports = new User();
