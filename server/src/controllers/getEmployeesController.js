import pool from '../config/db.js';
import employeeRepository from '../Repositories/employeeRepository.js';

async function getEmployeeByCnicController(req, res) {
    const cnic = req.params.cnic;
    const employee = await employeeRepository.getEmployeeByCnic(cnic);
    res.json(employee);
}

async function getEmployeesController(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const search = req.query.search?.trim || '';
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

async function patchEmployeeController(req, res) {
    const id = req.params.id;
    const body = req.body;
    const result = await employeeRepository.patchEmployee(id, body);
    console.log(result);
    if (result.code === 400) {
        res.status(400).send(result);
        return;
    }
    res.send(result);
}

export {
    getEmployeesController,
    getEmployeeByCnicController,
    patchEmployeeController,
};
