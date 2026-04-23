import pool from '../../../config/db.js';
import AppError from '../../../shared/utils/AppError.js';

async function create({ semester, year, department, section, created_by }) {
    try {
        const query =
            'INSERT INTO ug_batch (semester, year, department, section, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const params = [semester, year, department, section, created_by];
        const res = await pool.query(query, params);

        return res.rows[0];
    } catch (e) {
        if (e.code === '23505') {
            throw new AppError(
                'A batch with the same department, section, year and semester already exists',
                409,
            );
        }
        throw e;
    }
}

export default { create };
