const pool = require('./postgres');

class Configuration {
  constructor() {
    this.ready = (async () => {
      // initialize the table
      return pool.query(`
        CREATE TABLE IF NOT EXISTS "configuration" (
          name      TEXT    NOT NULL    PRIMARY KEY,
          val       TEXT,
          updated   TIMESTAMPTZ         NOT NULL      DEFAULT current_timestamp
        );

        CREATE OR REPLACE FUNCTION configuration_timestamp_update() RETURNS TRIGGER AS $configuration_timestamp_update$
          BEGIN
            NEW.updated = NOW();
            RETURN NEW;
          END;
        $configuration_timestamp_update$ LANGUAGE plpgsql;

        DO
        $$
        BEGIN
          IF NOT EXISTS (SELECT * FROM information_schema.triggers
            WHERE event_object_table = 'configuration'
              AND trigger_name = 'configuration_timestamp_update')
            THEN CREATE TRIGGER configuration_timestamp_update BEFORE INSERT OR UPDATE ON "configuration"
              FOR EACH ROW EXECUTE PROCEDURE configuration_timestamp_update();
          END IF;
        END;
        $$
      `).catch(err => {
        console.error('Unable to create the configuration table in the aux database: ', err);
        process.exit(-1);
      });
    })();
  }

  async get(name, initial) {
    const query = await pool.query('SELECT * FROM "configuration" cfg WHERE cfg.name = $1;', [name]);

    if (query.rowCount < 1 && !initial) {
      return null;
    } else if(query.rowCount < 1) {
      await this.set(name, initial);
      return await this.get(name, null);
    }

    return query.rows[0];
  }

  async set(name, value) {
    await pool.query(`
      INSERT INTO "configuration" (name, val, updated)
        VALUES ($1, $2, NOW())
        ON CONFLICT (name) DO UPDATE
          SET val = $2, updated = NOW()
          WHERE "configuration".val <> $2
    `, [name, value || null]);
  }

  async getAll() {
    const query = await pool.query('SELECT * FROM "configuration";');
    let map = {};
    query.rows.forEach(item => {
      map[item.name] = item;
    });

    return map;
  }
}

module.exports = new Configuration();
