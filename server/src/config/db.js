import pkg from 'pg';
import 'dotenv/config';
pkg.types.setTypeParser(pkg.types.builtins.DATE, (val) => val); // don't parse dates

const { Pool } = pkg;

const pool = new Pool({
    user: process.env.PGUSER,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
});

export default pool;
