const pool = require('../database/postgres');

class Configuration {
  constructor() {
    (async () => {
      let connection = await pool.connect().catch(err => {
        console.error(err);
        console.error('failed to connect to postgres and initialize the configuration', err);
        process.exit(1);
      });

      connection.query(`
        CREATE TABLE IF NOT EXISTS "configuration" (
          name          TEXT        NOT NULL  PRIMARY KEY,
          val           TEXT,
          last_updated  TIMESTAMPTZ NOT NULL  DEFAULT current_timestamp
        );
      `).catch(err => {
        console.error(err);
        process.exit(1);
      });

      connection.release();
    })();
  }

  async get(name, initial) {
    let connection;
    let res = null;
    try {
      connection = await pool.connect();

      const query = await connection.query(
        'SELECT cfg.name, cfg.val, cfg.last_updated FROM "configuration" cfg WHERE cfg.name = $1;',
        [name]
      );

      // set to default if it wasn't found
      if (query.rows.length < 1 && initial) {
        await this.set(name, initial);
        return await this.get(name, null);
      } else if (query.rows.length < 1) {  // not found, no backup option
        return null;
      }

      res = {
        name: query.rows[0].name,
        value: query.rows[0].val,
        timestamp: query.rows[0].last_updated,
      };

    } catch(err) {
      console.error(err);
    } finally {
      connection.release();
    }

    return res;
  }

  async set(name, value) {
    let connection;
    try {
      connection = await pool.connect();

      const query = await connection.query(`
        INSERT INTO "configuration" (name, val, last_updated)
          VALUES ($1, $2, NOW())
          ON CONFLICT (name) DO UPDATE
            SET val = $2, last_updated = NOW()
            WHERE "configuration".val <> $2;
      `, [name, value || null]);

    } catch(err) {
      console.error(err);
    } finally {
      connection.release();
      return value;
    }
  }

  async getAll() {
    let connection;
    let finArray = {};
    try {
      connection = await pool.connect();
      
      const res = await connection.query(`SELECT * FROM "configuration";`);
      
      res.rows.forEach(row => {
        finArray[row.name] = {
          name: row.name,
          value: row.val,
          timestamp: row.last_updated,
        };
      });
    } catch(err) {
      console.error('failed to get all configuration options', err);
    } finally {
      connection.release();
    }

    return finArray;
  }
}

module.exports = new Configuration();

