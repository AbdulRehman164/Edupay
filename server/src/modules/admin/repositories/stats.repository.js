import pool from '../../../config/db.js';

async function getUsersCount() {
    const res = await pool.query(
        'SELECT role, COUNT(*) AS count FROM users GROUP BY role',
    );
    return res.rows;
}
export default { getUsersCount };
