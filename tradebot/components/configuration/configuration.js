const pool = require('../database/postgres');

class Configuration {
  constructor() {
    (async () => {
      pool.query(`
        CREATE TABLE IF NOT EXISTS "configuration" (
          name          TEXT        NOT NULL  PRIMARY KEY,
          val           TEXT,
          last_updated  TIMESTAMPTZ NOT NULL  DEFAULT current_timestamp
        );
      `).catch(err => {
        console.error(err);
        process.exit(1);
      });
    })();
  }

  async get(name, initial) {
    const query = await pool.query(
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

    return {
      name: query.rows[0].name,
      value: query.rows[0].val,
      timestamp: query.rows[0].last_updated,
    };
  }

  async set(name, value) {
    return pool.query(`
      INSERT INTO "configuration" (name, val, last_updated)
        VALUES ($1, $2, NOW())
        ON CONFLICT (name) DO UPDATE
          SET val = $2, last_updated = NOW()
          WHERE "configuration".val <> $2;
    `, [name, value || null]);
  }

  async getAll() {
    const res = await connection.query(`SELECT * FROM "configuration";`);
    let ret = {};
    
    res.rows.forEach(row => {
      ret[row.name] = {
        name: row.name,
        value: row.val,
        timestamp: row.last_updated,
      };
    });

    return ret;
  }
}

module.exports = new Configuration();

