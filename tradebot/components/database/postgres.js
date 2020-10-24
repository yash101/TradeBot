const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  database: process.env.PG_DB,
  user: process.env.PG_USER,
  password: process.env.PG_PASS,
  max: 100,
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err, client) => {
  console.error('Unexpected error ocurred with postgres: ', err);
});

// test the db connection
(async () => {
  const conn = await pool.connect();
  console.log('Connection to postgresql database was successful');
  conn.release(true);
})();

module.exports = pool;
