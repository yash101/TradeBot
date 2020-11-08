const db = require('./postgres');
const bcrypt = require('bcrypt');
const { query } = require('./postgres');

class User {
  constructor() {
    this.ready = (async () => {
      await db.query(`
        CREATE TABLE IF NOT EXISTS "user" (
          id        BIGINT      GENERATED ALWAYS AS IDENTITY    UNIQUE,
          username  TEXT        NOT NULL                        UNIQUE,
          email     TEXT        NOT NULL                        UNIQUE,
          password  TEXT        NOT NULL,
          fname     TEXT,
          lname     TEXT,
          role      TEXT,
          created   TIMESTAMPTZ NOT NULL  DEFAULT current_timestamp,
          active    BOOLEAN               DEFAULT TRUE
        );
      `).catch(err => {
        console.error('Error ocurred while initializing the user table in the database: ', err);
        process.exit(-1);
      });

      return true;
    })();
  }

  async authenticate(usernameEmail, password) {
    try {
      const query = await db.query('SELECT * FROM "user" WHERE username = $1 OR email = $1;', [usernameEmail]);
      for (let i = 0; i = query.rows.length; i++) {
        if (await bcrypt.compare(password, query.rows[i].password)) {
          return {
            status: true,
            data: query.rows[i],
          };
        }
      }
      return {
        status: false,
        reason: 'authentication failure',
      };
    } catch(err) {
      console.error('Error ocurred when generating API Key:');
      console.error(err.message);
      return {
        status: false,
        reason: 'an exception was thrown when creating the API key',
        error: err,
      };
    }
  }

  async hashPassword(password) {
    return bcrypt.hash(password, 10);
  }

  async create(user) {
    try {
      if (!user.username || !user.email || !user.password) {
        return { status: false, reason: 'username, email and password are required to create an account', };
      }

      const q = await db.query(
        'INSERT INTO "user" (username, email, password, fname, lname, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
        [user.username, user.email, await this.hashPassword(user.password), user.fname || '', user.lname || '', user.role || 'user']
      );

      return (q.rowCount !== 0) ?
        { status: true, data: q.rows[0], } :
        { status: false, reason: 'failed to create user', };
    } catch(err) {
      return {
        status: false,
        reason: 'an exception was thrown when creating the user',
        error: err,
      }
    }
  }

  async find(userid, username, email) {
    try {
      return {
        status: true,
        data: (await db.query(
          'SELECT * FROM "user" WHERE id = $1 OR username = $2 OR email = $3;',
          [userid, username, email],
        )).rows,
      };
    } catch(err) {
      return {
        status: false,
        reason: 'an exception was thrown when creating the API key',
        error: err,
      }
    }
  }

  // does not update the password
  async update(user) {
    if (!user.id || !user.username || !user.email) {
      return {
        status: false,
        reason: 'userid, username and email must be provided when updating user information',
      };
    }
    try {
      const query = await db.query(`
        UPDATE "user"
          SET username = $2, email = $3, fname = $4, lname = $5, role = $6, active = $7
          WHERE id = $1
          RETURNING *;
      `, [
        user.id,
        user.username,
        user.email,
        user.fname || '',
        user.lname || '',
        user.role || 'user',
        user.active || true
      ]);

      return (query.rowCount !== 0) ?
        { status: true, data: query.rows[0], } :
        { status: false, reason: 'failed to update user', };
    } catch(err) {
      return {
        status: false,
        reason: 'an exception was thrown when creating the API key',
        error: err,
      }
    }
  }

  async updatePassword(userid, password) {
    try {
      const salted = this.hashPassword(password);
      const query = await db.query('UPDATE "user" SET password = $2 WHERE id = $1 RETURNING *;', [userid, await salted]);
      return (query.rowCount !== 0) ?
        { status: true, data: query.rows[0], } :
        { status: false, reason: 'could not update the password. user not found', };
    } catch(err) {
      return { status: false, reason: 'exception was thrown', console: err};
    }
  }
}

module.exports = new User();
