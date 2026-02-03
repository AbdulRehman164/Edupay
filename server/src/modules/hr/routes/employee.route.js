import { Router } from 'express';
import {
    getEmployeesController,
    patchEmployeesController,
} from '../controllers/employees.controller.js';

const employeeRoutes = Router();

employeeRoutes.get('/', getEmployeesController);
employeeRoutes.patch('/:id', patchEmployeesController);

export default employeeRoutes;
