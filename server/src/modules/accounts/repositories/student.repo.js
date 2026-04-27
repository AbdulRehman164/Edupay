import pool from '../../../config/db.js';

async function get(batchId) {
    const res = await pool.query(
        'SELECT * from ug_batch_student WHERE batch_id=$1',
        [batchId],
    );
    return res.rows;
}

export default { get };
