import pool from '../../../config/db.js';
import { updateEmployee } from '../services/employeeUpdate.service.js';
import AppError from '../../../shared/utils/AppError.js';

async function getEmployeesController(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const search = req.query.search?.trim() || '';
    const offset = (page - 1) * limit;

    let employeesQuery = 'SELECT * FROM employees';
    let countQuery = 'SELECT COUNT(*) FROM employees';
    const params = [];
    const countParams = [];

    if (search) {
        employeesQuery += ' WHERE name ILIKE $1 OR cnic_no ILIKE $1';
        countQuery += ' WHERE name ILIKE $1 OR cnic_no ILIKE $1';
        params.push(`%${search}%`);
        countParams.push(`%${search}%`);
    }

    employeesQuery += ` ORDER BY id LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    try {
        const [employeesRes, countRes] = await Promise.all([
            pool.query(employeesQuery, params),
            pool.query(countQuery, countParams),
        ]);

        const total = parseInt(countRes.rows[0].count);

        res.json({
            employees: employeesRes.rows,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

async function patchEmployeesController(req, res) {
    try {
        const id = req.params.id;
        const data = req.body;
        await updateEmployee(id, data);
        res.json({ message: 'Updated Successfully' });
    } catch (e) {
        if (e.code === '23505') {
            throw new AppError('CNIC already exists.', 400, {
                field: 'cnic_no',
            });
        } else {
            throw e;
        }
    }
}

export { getEmployeesController, patchEmployeesController };
