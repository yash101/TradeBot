const db = require('./postgres');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('./user');

const decodeScopes = (row) => {
  const nrow = row;
  nrow.scopes = JSON.parse(nrow.scopes);
  return nrow;
};

class ApiKey {
  constructor() {
    this.ready = (async () => {
      await User.ready;
      return db.query(`
        CREATE TABLE IF NOT EXISTS "apikey" (
          keyid   BIGINT      GENERATED ALWAYS AS IDENTITY  UNIQUE,
          secret  TEXT        NOT NULL,
          owner   BIGINT      NOT NULL                      UNIQUE,
          created TIMESTAMPZ  NOT NULL    DEFAULT current_timestamp,
          scopes  TEXT,

          CONSTRAINT fk_owner
            FOREIGN KEY (owner)
            REFERENCES "user"(id)
        );
      `).catch(err => {
        console.error(err.message);
        process.exit(-1);
      });
    })();
  }

  async generate(userid) {
    try {
      const secret = bcrypt.hash(crypto.randomBytes(int(128 * 2 / 3)).toString('base64'), 10);
      const checkIfUseridValid = await db.query('SELECT 1 FROM "user" WHERE id = $1;', [userid]);

      if (checkIfUseridValid.rowCount === 0) {
        return {
          status: false,
          reason: 'No user exists with provided userid',
        };
      }

      const addKey = await db.query(
        'INSERT INTO "apikey" (secret, owner, scopes) VALUES ($1, $2, $3) RETURNING *;',
        [await secret, userid, JSON.stringify([])]
      );

      return (addKey.rowCount !== 0) ?
        { status: true, data: decodeScopes(addKey.rows[0]), } :
        { status: false, reason: 'Failed to create API key'};
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

  async revoke(keyid) {
    try {
      const query = await db.query(
        'DELETE FROM "apikey" WHERE keyid = $1 RETURNING *;',
        [keyid]
      );

      return (query.rowCount !== 0) ?
        { status: true, data: decodeScopes(query.rows[0]), } :
        { status: false, reason: 'failed to delete key. the key likely does not exist', };
    } catch(err) {
      console.error('Error ocurred when revoking the API key:');
      console.error(err);
      return {
        status: false,
        reason: 'an exception was thrown when revoking the requested API key',
        error: err,
      };
    }
  }

  async list(userid) {
    try {
      const query = await db.query('SELECT * FROM "apikey" WHERE owner = $1;', [userid]);
      let ret = [];
      query.rows.forEach(row => {
        ret.push(decodeScopes(row));
      });
      return { status: true, data: ret, };
    } catch(err) {
      console.error('Error ocurred when listing the API keys:');
      console.error(err);
      return {
        status: false,
        reason: 'an exception was thrown when listing the API keys',
        error: err,
      };
    }
  }

  async getByKeyid(keyid) {
    try {
      const query = await db.query('SELECT * FROM "apikey" WHERE keyid = $1;');
      if (query.rowCount === 0) return { status: false, reason: 'key not found', };
      return { status: true, data: decodeScopes(query.rows[0]), };
    } catch(err) {
      console.error('Error ocurred when listing the API keys:');
      console.error(err);
      return {
        status: false,
        reason: 'an exception was thrown when listing the API keys',
        error: err,
      };
    }
  }

  async updateScopes(keyid, scopes) {
    try {
      const newScopes = scopes || [];
      const query = await db.query(
        'UPDATE "apikey" SET scopes = $2 WHERE keyid = $1;',
        [keyid, JSON.stringify(scopes)]
      );
    } catch(err) {
      console.error('Error ocurred when listing the API keys:');
      console.error(err);
      return {
        status: false,
        reason: 'an exception was thrown when listing the API keys',
        error: err,
      };
    }
  }

  async authenticate(keyid, secret) {
    try {
      const query = await db.query('SELECT * FROM "apikey" WHERE keyid = $1;', [keyid]);
      return (query.rowCount !== 0 && await bcrypt.compare(secret, query.rows[0].secret)) ?
        { status: true, data: decodeScopes(query.rows[0]), } :
        { status: false, reason: 'unable to authenticate', };
    } catch(err) {
      console.error('Error ocurred when listing the API keys:');
      console.error(err);
      return {
        status: false,
        reason: 'an exception was thrown when authenticating api key',
        error: err,
      };
    }
  }
}

module.exports = new ApiKey();
