import { Router } from 'express';
import {
    getEmployeesController,
    patchEmployeesController,
} from '../controllers/employees.controller.js';
import requireRole from '../middleware/requireRole.middleware.js';

const employeeRoute = Router();

employeeRoute.use(requireRole('hr'));

employeeRoute.get('/', getEmployeesController);
employeeRoute.patch('/:id', patchEmployeesController);

export default employeeRoute;
