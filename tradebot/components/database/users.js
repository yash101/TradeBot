const db = require('./postgres');
const bcrypt = require('bcrypt');

// sets up the database
let dbconn = (async () => {
  /**
   *        +---[auth id]
   * [user]-+---[auth id]
   *        +---[auth id]
   */
  await db.query(`
    CREATE TABLE IF NOT EXISTS "user" (
      userid      BIGSERIAL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      username    TEXT                  NOT NULL    UNIQUE,
      email       TEXT                  NOT NULL,
    );
  `).catch(err => {
    console.error(err);
    process.exit(-1);
  });
  
  /**
  * username: username of user OR API client ID
  * password: password of user OR API secret
  * parent_id: user id of the user which owns this entry
  */
  await db.query(`
    CREATE TABLE IF NOT EXISTS "auth" (
      clientid   TEXT    PRIMARY KEY   NOT NULL   UNIQUE,
      secret     TEXT                  NOT NULL,
      salt       TEXT                  NOT NULL,
      parentid   BIGINT,
      last_login TIMESTAMPTZ,
      CONSTRAINT fk_userid FOREIGN KEY parentid REFERENCES user(userid);
    );
  `).catch(err => {
      console.error(err);
      process.exit(-1);
  });
})();

/** Methods required:
 * - User:
 *    - Create
 *    - Update
 *    - Delete
 *    - Get
 * - Auth
 *    - Create
 *    - Update
 *    - Delete
 *    - Get
 * - Authenticate
 */
class User {
  constructor() {
  }


  /** Authenticates using a client_id and a secret
   * Returns userid that owns the client_id or null
   * 
   * @param {String} client_id 
   * @param {String} secret 
   */
  static async authenticate(client_id, secret) {
    const res = await db.query(
      'SELECT * FROM "auth" a WHERE a.clientid = $1',
      [client_id]
    );
  
    if (res.rowCount < 1) {
      return null;
    }
  
    const pwHash = await bcrypt.hash(secret, res.rows[0].salt);
  
    // check secret
    if (pwHash === res.rows[0].secret) {
      // update last login time
      await db.query(
        'UPDATE "auth" SET last_login = NOW() WHERE clientid = $1',
        [client_id]
      );

      // return the userid
      return res.rows[0].parentid;
    }
  }

  /**
   */
}

/**
 * get a user from the data given
 * scopes = array['user', 'keys']
*/
const findUser = async (username, userid, email, scopes) => {
  scopes = scopes || [];
  let query;
  if (userid) {
    query = await db.query('SELECT * FROM "user" u WHERE u.userid = $1', [userid]);
  } else if (username) {
    query = await db.query('SELECT * FROM "user" u WHERE u.username = $1', [username]);
  } else if (email) {
    query = await db.query('SELECT * FROM "user" u WHERE u.email = $1', [email]);
  }

  if (query.rowCount < 1) {
    return null;
  }

  let u = new User();
  u.username = query.rows[0].username;
  u.userid = query.rows[0].userid;
  u.email = query.rows[0].email;
  u.authKeys = [];

  if (scopes.find(x => x === 'keys')) {
    const sq = await db.query('SELECT * FROM "auth" a WHERE a.parentid = $1', [u.userid]);

    sq.rows.forEach(row => {
      u.authKeys.push({
        clientid: row.clientid,
        secret: row.secret,
        salt: row.salt,
        parentId: row.parentid,
        lastLogin: row.last_login,
      });
    });
  }

  return u;
};

