const db = require('./postgres');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

class User {
  constructor() {
    this.ready = (async () => {
      return db.query(`
        --- userid, username, email, name, role created
        CREATE TABLE IF NOT EXISTS "user" (
          id        BIGINT      GENERATED ALWAYS AS IDENTITY  UNIQUE,
          username  TEXT        NOT NULL  UNIQUE,
          email     TEXT        NOT NULL  UNIQUE,
          fname     TEXT,
          lname     TEXT,
          role      TEXT,
          created   TIMESTAMPTZ NOT NULL  DEFAULT current_timestamp
        );

        CREATE TABLE IF NOT EXISTS "auth_keys" (
          keyid     BIGINT      GENERATED ALWAYS AS IDENTITY,
          parentid  BIGINT      NOT NULL,
          clientid  TEXT        NOT NULL  UNIQUE,
          secret    TEXT        NOT NULL,
          created   TIMESTAMPTZ NOT NULL  DEFAULT current_timestamp,
          lastlogin TIMESTAMPTZ           DEFAULT NULL,
          disabled  BOOLEAN     NOT NULL  DEFAULT FALSE,    --- currently not used

          CONSTRAINT fk_parentid
            FOREIGN KEY(parentid)
            REFERENCES "user"(id)
        );

        --- USERNAME, EMAIL, ROLE, FNAME, LNAME
        CREATE OR REPLACE FUNCTION user_create_user (username TEXT, email TEXT, role TEXT, fname TEXT, lname TEXT, password TEXT) RETURNS SETOF "user" AS $$
          DECLARE
            userid  BIGINT;
          BEGIN
            IF username IS NULL OR email IS NULL THEN
              RAISE EXCEPTION 'Username and email must not be null';
            END IF;

            --- create the user
            INSERT INTO "user" (username, email, fname, lname, role) VALUES (username, email, fname, lname, role) RETURNING id INTO userid;

            --- create the auth keys
            --- create the authorization keys or update them if they exist for some reason
            INSERT INTO "auth_keys" (parentid, clientid, secret) VALUES (userid, username, password)
              ON CONFLICT (clientid) DO UPDATE
                SET secret = password, clientid = username, parentid = userid, created = NOW(), disabled = FALSE;

            INSERT INTO "auth_keys" (parentid, clientid, secret) VALUES (userid, email, password)
              ON CONFLICT (clientid) DO UPDATE
                SET secret = password, clientid = email, parentid = userid, created = NOW(), disabled = FALSE;
            
            RETURN QUERY SELECT * FROM "user" u WHERE u.id = userid LIMIT 1;
          END;
        $$ LANGUAGE plpgsql;

        --- FIND USER
        CREATE OR REPLACE FUNCTION user_find_user (userid BIGINT, uname TEXT, emailAddress TEXT) RETURNS SETOF "user" AS $$
          BEGIN
            IF userid IS NOT NULL THEN
              RETURN QUERY SELECT * FROM "user" u WHERE u.id = userid LIMIT 1;
            ELSIF uname IS NOT NULL THEN
              RETURN QUERY SELECT * FROM "user" u WHERE u.username = uname LIMIT 1;
            ELSE
              RETURN QUERY SELECT * FROM "user" u WHERE u.email = emailAddress LIMIT 1;
            END IF;
          END;
        $$ LANGUAGE plpgsql;

        --- UPDATE USER
        CREATE OR REPLACE FUNCTION user_update_user (userid BIGINT, emailAddress TEXT, firstName TEXT, lastName TEXT, userRole TEXT) RETURNS SETOF "user" AS $$
          BEGIN
            IF userid IS NULL THEN
              RAISE EXCEPTION 'Userid is required to update a user';
            END IF;

            IF NOT EXISTS (SELECT 1 FROM "user" WHERE id = userid) THEN
              RAISE EXCEPTION 'User does not exist';
            END IF;

            IF emailAddress IS NOT NULL THEN
              UPDATE "user" SET email = emailAddress WHERE id = userid;
            END IF;

            IF firstName IS NOT NULL THEN
              UPDATE "user" SET fname = firstName WHERE id = userid;
            END IF;

            IF lastName IS NOT NULL THEN
              UPDATE "user" SET lname = lastName WHERE id = userid;
            END IF;

            IF userRole IS NOT NULL THEN
              UPDATE "user" SET role = userRole WHERE id = userid;
            END IF;

            RETURN QUERY SELECT * FROM "user" u WHERE id = userid LIMIT 1;
          END;
        $$ LANGUAGE plpgsql;
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

      if (await bcrypt.compare(secret, query.rows[0]['secret'])) {
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

  async hashPassword(password) {
    return await bcrypt.hash(
      password,
      await bcrypt.genSalt(10),
    );
  }

  async updatePassword(clientid, password) {
    try {
      if ((await db.query('SELECT keyid FROM "auth_keys" k WHERE k.clientid = $1;', [clientid])).rowCount === 0) {
        return {
          status: false,
          reason: 'invalid clientid. create the auth key entry first then update its password.',
        };
      }

      const query = await db.query(
        'UPDATE "auth_keys" SET secret = $2 WHERE clientid = $1 RETURNING *;',
        [clientid, await this.hashPassword(password)]
      );

      return (query.rowCount !== 0) ?
        { status: true, data: query.rows[0], } :
        { status: false, reason: 'failed to update password' };
    } catch(err) {
      return {
        status: false,
        reason: 'an exception was thrown',
        error: err,
      };
    }
  }
  async findUser(search) {
    try {
      let queries = [];
      if (search.userid) queries.push(db.query('SELECT * FROM user_find_user($1, NULL, NULL);', [search.userid]));
      if (search.username) queries.push(db.query('SELECT * FROM user_find_user(NULL, $1, NULL);', [search.username]));
      if (search.email) queries.push(db.query('SELECT * FROM user_find_user(NULL, NULL, $1);', [search.email]));

      const uidS = await queries[0];
      if (uidS.rowCount !== 0) return {
        status: true,
        data: uidS.rows[0],
      };
      
      const uidU = await queries[1];
      if (uidU.rowCount !== 0) return {
        status: true,
        data: uidU.rows[0],
      };

      const uidE = await queries[2];
      if (uidE.rowCount !== 0) return {
        status: true,
        data: uidE.rows[0],
      };

      return {
        status: true,
        data: [],
      };
    } catch(err) {
      return {
        status: false,
        reason: 'an exception was thrown',
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

  // data = {
  //   username, email, password, fname, lname, role 
  // }
  async newUser(data) {
    try {
      if (!data.username || !data.email)
        return { status: false, reason: 'username and email must be provided', };
      
      const newUserQuery = await db.query(`
        SELECT * FROM user_create_user($1, $2, $3, $4, $5, $6);
      `, [data.username, data.email, data.role || 'user', data.fname, data.lname, 'temporary password']);

      const p1q = this.updatePassword(data.username, data.password);
      const p2q = this.updatePassword(data.email, data.password);

      const q1 = await p1q;
      const q2 = await p2q;

      if (!q1.status) return q1;
      if (!q2.status) return q2;

      return {
        status: true,
        data: (newUserQuery.rowCount !== 0) ? newUserQuery.rows[0] : null,
      };
    } catch(err) {
      return {
        status: false,
        reason: 'an exception was thrown',
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
