import { Router } from 'express';
import {
    getEmployeesController,
    patchEmployeesController,
} from '../controllers/employees.controller.js';

const employeeRoute = Router();

employeeRoute.get('/', getEmployeesController);
employeeRoute.patch('/:id', patchEmployeesController);

export default employeeRoute;
