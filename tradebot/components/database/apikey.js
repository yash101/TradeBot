const db = require('./postgres');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('./user');

module.exports = {
  ready: (async () => {
    return db.query(`
      CREATE TABLE IF NOT EXISTS "key" (
        key     BIGINT      GENERATED ALWAYS AS IDENTITY    UNIQUE,
        secret  TEXT        NOT NULL,
        parent  BIGINT      NOT NULL                        UNIQUE,
        created TIMESTAMPTZ NOT NULL                        UNIQUE,
        enabled BOOLEAN     NOT NULL  DEFAULT FALSE,
        descr   TEXT,
        expires TIMESTAMPTZ,
        
        CONSTRAINT fk_parent
          FOREIGN KEY (parent)
          REFERENCES "user"(id)
      );

      CREATE TABLE IF NOT EXISTS "key_scopes" (
        key     BIGINT      NOT NULL,
        scope   TEXT        NOT NULL,
        active  BOOLEAN     NOT NULL  DEFAULT FALSE

        CONSTRAINT fk_key
          FOREIGN KEY (key)
          REFERENCES "key"(key)
      );
    `);
  })(),
  create: async (parent, description, expires, enabled, scopes) => {
    try {
      // create a secret
      const secret = crypto.randomBytes(32).toString('base64');
      const hashed = await bcrypt.hash(secret, 10);
      const main = await db.query(`
        INSERT INTO "key"
          (secret, parent, created, enabled, descr, expires)
          VALUES ($1, $2, NOW(), $4, $5)
          RETURNING *;
      `, [
        hashed,
        parent,
        enabled,
        description,
        expires
      ]);

      const key = main.rows[0]['key'];

      await Promise.all(
        scopes.map(scope => {
          return db.query(`
            INSERT INTO "key_scopes"
              (key, scope, active)
              VALUES ($1, TRUE, $2);
          `, [key, scope]);
        }),
      );

      return {
        status: true,
        key: key,
        secret: secret,
        data: { ...main.rows[0], scoppes: scopes },
      };
    } catch(err) {
      console.error(err);
      return {
        status: false,
        reason: 'unknown error was encountered while creating the user',
      };
    }
  },
  authenticate: async (key, secret) => {
    const query = await db.query(`
      SELECT * FROM "key" WHERE key = $1;
    `, [key]);
    if (query.rowCount === 0) {
      return {
        status: false,
        error: 'authentication failed. invalid key',
      };
    }

    const match = await bcrypt.compare(secret, query.rows[0].secret);

    if (match) {
      return {
        status: true,
        key: query.rows[0],
      }
    } else {
      return {
        status: false,
        error: 'authentication failure. secret did not match',
      }
    }
  },
  get: async (key) => {
    const key = await db.query(`
      SELECT * FROM "key" WHERE key = $1;
    `, [key]);

    if (key.rowCount === 0) {
      return {
        status: false,
        error: 'key does not exist',
      };
    }

    const scopes = await db.query(`
      SELECT * FROM "key_scopes" WHERE key = $1;
    `, [key]);

    return {
      key: key.rows[0],
      scopes: scopes.rows,
    };
  },
  scopes: {
    add: async (key, scope) => {
      const keyexists = await db.query(`
        SELECT 1 FROM "key" WHERE kew = $1;
      `, [key]);

      if (keyexists.rowCount === 0) {
        return {
          status: false,
          error: 'key does not exist',
        };
      }

      const scopeexists = await db.query(`
        SELECT 1 FROM "key_scopes" WHERE key = $1 AND scope = $2;
      `, [key, scope]);

      if (scopeexists.rowCount !== 0) {
        return {
          status: true,
          error: 'scope already exists',
        };
      }

      const scopeadd = await db.query(`
        INSERT INTO "key_scopes" (key, scope, active) VALUES ($1, $2, TRUE);
      `, [key, scope]);

      return {
        status: true,
      };
    },
    remove: async (key, scope) => {
      await db.query(`
        DELETE FROM "key_scopes" WHERE key = $1 AND scope = $2;
      `, [key, scope]);
    },
    get: async (key, scope) => {
      if (!scope) {
        const q = await db.query('SELECT scope FROM "key_scopes" WHERE key = $1;', [key]);
        return {
          status: true,
          scopes: q.rows,
        };
      } else {
        const q = await db.query('SELECT 1 FROM "key_scopes" WHERE key = $1 AND scope = $2', [key, scope]);

        return {
          status: true,
          ret: q.rowCount !== 0,
        };
      }
    },
  },
};
