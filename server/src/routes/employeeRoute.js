import { Router } from 'express';
import {
    getEmployeesController,
    getEmployeeByCnicController,
    patchEmployeeController,
} from '../controllers/getEmployeesController.js';

const employeeRoute = Router();

employeeRoute.get('/', getEmployeesController);
employeeRoute.get('/:cnic', getEmployeeByCnicController);
employeeRoute.patch('/:id', patchEmployeeController);

export default employeeRoute;
