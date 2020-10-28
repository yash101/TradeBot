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
      CONSTRAINT fk_userid FOREIGN KEY parentid REFERENCES user(userid)
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
  constructor(userid, username, email, authkeys) {
    this.userid = userid;
    this.username = username;
    this.email = email;
    this.authkeys = authkeys || [];
  }

  getUserId() { return self.userid; }
  getUsername() { return self.username; }
  getEmail() { return self.email; }
  getAuthKeys() { return self.authKeys || []; }
  setUserId(uid) { self.userid = uid; return this; }
  setUsername(username) { self.username = username; return this; }
  setEmail(email) { self.email = email; return this; }
  setAuthKeys(keys) { self.authkeys = keys; return this; }

  async flush() {
    return User.updateUser(this.getUserId(), this);
  }

  /** Authenticates using a client_id and a secret
   * Returns userid that owns the client_id or null
   * 
   * @param {String} client_id 
   * @param {String} secret 
   */
  static async authenticate(client_id, secret) {
    const res = await db.query(
      'SELECT * FROM "auth" a WHERE a.clientid = $1;',
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
        'UPDATE "auth" SET last_login = NOW() WHERE clientid = $1;',
        [client_id]
      );

      // return the userid
      return res.rows[0].parentid;
    }
  }

  /**
   * data: {
   *  username: ?,
   *  userid: ?,
   *  email: ?
   * }
   */
  static async getUser(data) {
    if (!data) return null;

    const query;
    if (data.username) {
      query = await db.query('SELECT * FROM "user" u WHERE u.username = $1;', [data.username]);
    } else if (data.userid) {
      query = await db.query('SELECT * FROM "user" u WHERE u.userid = $1;', [data.userid]);
    } else if (data.email) {
      query = await db.query('SELECT * FROM "user" u WHERE u.email = $1;', [data.email]);
    } else {
      return null;
    }

    if (query.rowCount < 1) {
      return null;
    }

    return new User().setUserId(query.rows[0].userid).setEmail(query.rows[0].email).setUsername(query.rows[0].username);
  }

  static async updateUser(userid, user) {
    if (!user) throw Error('User was null');
    return db.query(
      'UPDATE "user" SET username = $2, email = $3 WHERE userid = $1',
      [user.getUserId(), user.getUsername(), user.getEmail()]
    );
  }

  static async newUser(user) {
    if (!user) throw Error('User was null');
    const query = await db.query(`
      INSERT INTO "user" (userid, username, email) VALUES (DEFAULT, $1, $2) ON CONFLICT DO NOTHING;
      SELECT u.userid FROM "user" WHERE u.username = $1 AND u.email = $2;
    `, [user.getUsername(), user.getEmail()]);

    if (query.rowCount < 1) throw Error('Failed creating new user');

    return user.setUserId(query.rows[0].userid);
  }
}
