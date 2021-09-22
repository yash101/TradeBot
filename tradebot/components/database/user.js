const db = require('./postgres');
const bcrypt = require('bcrypt');

const pwHash = async = (password) => {
  return bcrypt.hash(password, process.env.PW_SALT_ROUNDS || 10);
};

module.exports = {
  ready: (async () => {
    await db.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        id          BIGINT                  UNIQUE    GENERATED ALWAYS AS IDENTITY
        username    TEXT        NOT NULL    UNIQUE,
        email       TEXT        NOT NULL    UNIQUE,
        password    TEXT        NOT NULL,
        fname       TEXT        NOT NULL,
        lname       TEXT        NOT NULL,
        created     TIMESTAMPTZ NOT NULL              DEFAULT current_timestamp,
        active      BOOLEAN     NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "user_scopes" (
        userid      BIGINT      NOT NULL,
        scope       TEXT        NOT NULL,
        active      BOOLEAN     NOT NULL              DEFAULT FALSE,
        CONSTRAINT  fk_userid
          FOREIGN KEY (userid)
          REFERENCES "user"(id)
      );
    `);
  })(),
  create: async (username, email, password, fname, lname, active) => {
    const hashedPassword = pwHash(password);
    if (
      !username ||
      !email ||
      !password ||
      !fname ||
      !lname ||
      username.length < 6 ||
      email.length < 3 ||
      password.length < 6 ||
      !email.contains('@') ||
      fname.length < 1 ||
      lname.length < 1
    ) {
      return {
        status: false,
        retcode: 400,
        reason: 'username, email, first name or last name or password too short or invalid',
      };
    }

    try {
      const query = await db.query(`
        INSERT INTO "user"
          (username, email, password, fname, lname, created, active)
          VALUES ($1, $2, $3, $4, $5, NOW(), $6)
          RETURNING *;
      `, [username, email, await hashedPassword, fname, lname, active]);

      return (query.rowCount !== 0) ?
        {
          status: true,
          user: query.rows[0],
        } :
        {
          status: false,
          retcode: 500,
          reason: 'An unknown error occurred while creating the user',
        };
    } catch(err) {
      if(process.env.DEBUG_QUERIES) console.error(err);
      return {
        status: false,
        reason: 'Failed to create user. Perhaps the user already exists?',
      };
    }
  },
  authenticate: async (username, password) => {
    try {
      const query = await db.query(
        `SELECT * FROM "user" WHERE username = $1 OR email = $1`,
        [username]
      );

      return (query.rowCount !== 0 && await bcrypt.compare(password, query.rows[0].password)) ?
        { status: true, user: query.rows[0], } :
        { status: false, reason: 'authentication failure' };
    } catch(err) {
      if(process.env.DEBUG_QUERIES) console.error(err);
      return { status: false, retcode: 500, error: 'unknown error' };
    }
  },
  get: async ({ userid, username, email, any }) => {
    try {
      const query = await db.query(`
        SELECT * FROM "user" WHERE
          id = $1 OR username = $2 OR email = $3 OR username = $4 OR email = $4;
      `, [userid || null, username || null, email || null, any || null]);

      return {
        status: true,
        users: query.rows,
      };
    } catch(err) {
      if(process.env.DEBUG_QUERIES) console.error(err);
      return { status: true, reason: 'unknown error', };
    }
  },
  update: async (search, update) => {
    if (!search || !update) {
      return { status: false, reason: 'no search parameter or update parameter given', };
    }
    try {
      const found = await db.query(
        `SELECT id FROM "user" WHERE id = $1 OR username = $2 OR email = $3 OR username = $4 OR email = $4;`,
        [
          search.userid || null,
          search.username || null,
          search.email || null,
          search.any || null,
      ]);

      await Promise.all(found.rows.map(async (row) => {
        const queries = [];

        if (update.username) {
          queries.push(db.query('UPDATE "user" SET username = $2 WHERE id = $1', [row.id, update.username]));
        }
        
        if (update.email) {
          queries.push(db.query('UPDATE "user" SET email = $2 WHERE id = $1', [row.id, update.email]));
        }
        
        if (update.email) {
          queries.push(db.query('UPDATE "user" SET email = $2 WHERE id = $1', [row.id, update.email]));
        }
        
        // note: different name used to prevent mistakes from overwriting the password :)
        if (update.updatePassword) {
          const pw = pwHash(update.updatePassword);
          queries.push(db.query('UPDATE "user" SET password = $2 WHERE id = $1', [row.id, await pw]));
        }
        
        if (update.fname) {
          queries.push(db.query('UPDATE "user" SET fname = $2 WHERE id = $1', [row.id, update.fname]));
        }
        
        if (update.lname) {
          queries.push(db.query('UPDATE "user" SET lname = $2 WHERE id = $1', [row.id, update.lname]));
        }
        
        if (update.active === true || update.active === false) {
          queries.push(db.query('UPDATE "user" SET active = $2 WHERE id = $1', [row.id, update.active]));
        }

        return Promise.all(queries);
      }));

      return { status: true, };
    } catch(err) {
      return { status: false, reason: 'unknown reason', };
    }
  },
  scopes: {
    get: async (userid) => {
      const q = await db.query('SELECT * FROM "user_scopes" WHERE userid = $1;', [userid]);

      return q.rows;
    },
    add: async (key, scope) => {
      
    },
    remove: async (key, scope) => {
    },
  },
};

module.exports.rootUserCreated = (async () => {
  // wait for the user table to be ready
  await module.exports.ready;
})();

// class User {
//   constructor() {
//     this.ready = (async () => {
//       await db.query(`
//         CREATE TABLE IF NOT EXISTS "user" (
//           id        BIGINT      GENERATED ALWAYS AS IDENTITY    UNIQUE,
//           username  TEXT        NOT NULL                        UNIQUE,
//           email     TEXT        NOT NULL                        UNIQUE,
//           password  TEXT        NOT NULL,
//           fname     TEXT,
//           lname     TEXT,
//           created   TIMESTAMPTZ NOT NULL  DEFAULT current_timestamp,
//           active    BOOLEAN               DEFAULT TRUE
//         );

//         CREATE TABLE IF NOT EXISTS "user_scopes" (
//           userid    BIGINT      NOT NULL,
//           scope     TEXT        NOT NULL,
//           active    BOOLEAN     NOT NULL  DEFAULT FALSE,

//           CONSTRAINT fk_userid
//             FOREIGN KEY (userid)
//             REFERENCES "user"(id)
//         );
//       `).catch(err => {
//         console.error('Error ocurred while initializing the user table in the database: ', err);
//         process.exit(-1);
//       });

//       return true;
//     })();
//   }

//   async authenticate(usernameEmail, password) {
//     try {
//       const query = await db.query('SELECT * FROM "user" WHERE username = $1 OR email = $1;', [usernameEmail]);

//       let authUser = null;

//       await Promise.all(query.rows.map(async (user) => {
//         if (authUser !== null) return; // skip
//         const match = await bcrypt.compare(password, user.password);
//         if (match) authUser = user;
//       }));

//       return (authUser === null) ?
//         { status: false, reason: 'authentication failure', } :
//         { status: true, data: authUser, };

//     } catch(err) {
//       return {
//         status: false,
//         reason: 'an exception was thrown when authenticating: ',
//         error: err,
//       };
//     }
//   }

//   async hashPassword(password) {
//     return bcrypt.hash(password, 10);
//   }

//   async create(user) {
//     try {
//       if (!user.username || !user.email || !user.password) {
//         return { status: false, reason: 'username, email and password are required to create an account', };
//       }

//       const q = await db.query(
//         'INSERT INTO "user" (username, email, password, fname, lname, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
//         [user.username, user.email, await this.hashPassword(user.password), user.fname || '', user.lname || '', user.role || 'user']
//       );

//       return (q.rowCount !== 0) ?
//         { status: true, data: q.rows[0], } :
//         { status: false, reason: 'failed to create user', };
//     } catch(err) {
//       return {
//         status: false,
//         reason: 'an exception was thrown when creating the user',
//         error: err,
//       }
//     }
//   }

//   async find(userid, username, email) {
//     try {
//       return {
//         status: true,
//         data: (await db.query(
//           'SELECT * FROM "user" WHERE id = $1 OR username = $2 OR email = $3;',
//           [userid, username, email],
//         )).rows,
//       };
//     } catch(err) {
//       return {
//         status: false,
//         reason: 'an exception was thrown when searching for the user',
//         error: err,
//       }
//     }
//   }

//   // does not update the password
//   async update(user) {
//     if (!user.id || !user.username || !user.email) {
//       return {
//         status: false,
//         reason: 'userid, username and email must be provided when updating user information',
//       };
//     }
//     try {
//       const query = await db.query(`
//         UPDATE "user"
//           SET username = $2, email = $3, fname = $4, lname = $5, role = $6, active = $7
//           WHERE id = $1
//           RETURNING *;
//       `, [
//         user.id,
//         user.username,
//         user.email,
//         user.fname || '',
//         user.lname || '',
//         user.role || 'user',
//         user.active || true
//       ]);

//       return (query.rowCount !== 0) ?
//         { status: true, data: query.rows[0], } :
//         { status: false, reason: 'failed to update user', };
//     } catch(err) {
//       return {
//         status: false,
//         reason: 'an exception was thrown when creating the API key',
//         error: err,
//       }
//     }
//   }

//   async updatePassword(userid, password) {
//     try {
//       const salted = this.hashPassword(password);
//       const query = await db.query('UPDATE "user" SET password = $2 WHERE id = $1 RETURNING *;', [userid, await salted]);
//       return (query.rowCount !== 0) ?
//         { status: true, data: query.rows[0], } :
//         { status: false, reason: 'could not update the password. user not found', };
//     } catch(err) {
//       return { status: false, reason: 'exception was thrown', console: err};
//     }
//   }
// }

// module.exports = new User();
