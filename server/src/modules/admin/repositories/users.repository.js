import pool from '../../../config/db.js';

async function getUserById(id) {
    const res = await pool.query(
        'SELECT id, username, role, created_at FROM users WHERE id=$1',
        [id],
    );
    return res.rows[0];
}

async function searchUsers(search, limit, offset) {
    let query = 'SELECT id, username, role, created_at FROM users';
    let params = [];
    if (search) {
        query += ' WHERE id ILIKE $1 OR name ILIKE $1';
        params.push(`%${search}%`);
    }
    query += ` ORDER BY id LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const res = await pool.query(query, params);

    return res.rows.length === 0 ? null : res.rows;
}

async function countUsers(search) {
    let query = 'SELECT COUNT(*) FROM users';
    let params = [];

    if (search) {
        query += ' WHERE id ILIKE $1 OR name ILIKE $1';
        params.push(`%${search}%`);
    }

    const res = await pool.query(query, params);

    return parseInt(res.rows[0].count);
}

async function create({ username, password, role }) {
    const query =
        'INSERT INTO users (username, password, role) VALUES($1, $2, $3) RETURNING *';
    const params = [username, password, role];
    const res = await pool.query(query, params);
    return res.rows[0];
}

async function remove(id) {
    const res = await pool.query('DELETE FROM users WHERE id=$1', [id]);
    return res.rowCount;
}

async function changeUsername({ username, id }) {
    const res = await pool.query(
        'UPDATE users SET username=$1 WHERE id=$2 RETURNING id, username, role, created_at',
        [username, id],
    );
    return res.rows[0];
}

export default {
    getUserById,
    searchUsers,
    countUsers,
    create,
    remove,
    changeUsername,
};
