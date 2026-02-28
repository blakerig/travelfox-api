const { Pool } = require('pg');

// PostgreSQL connection pool
const pool = new Pool({
    host: '13.36.39.66',
    port: 5432,
    database: 'travelfoxdb',
    user: 'postgres',
    password: 'pw'
});

module.exports = pool;