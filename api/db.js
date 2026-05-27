const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.PGHOST || "host.docker.internal",
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || "pickup",
  password: process.env.PGPASSWORD || "pickup",
  database: process.env.PGDATABASE || "pickup",
});

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
};
