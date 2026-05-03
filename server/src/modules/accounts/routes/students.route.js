import { Router } from 'express';
import requireRole from '../../../shared/middleware/requireRole.middleware.js';
import parseExcel from '../../../shared/middleware/parseExcel.middleware.js';
import {
    searchStudentsController,
    ugSubmitController,
    deleteStudentController,
    addStudentController,
    uploadController,
    feeVerifyController,
} from '../controllers/student.controller.js';
import upload from '../middleware/upload.middleware.js';
import validateAction from '../middleware/validateAction.js';

const studentsRoutes = Router({ mergeParams: true });

studentsRoutes.get('/', searchStudentsController);

studentsRoutes.patch(
    '/verify/:studentId',
    requireRole('accounts'),
    validateAction,
    feeVerifyController,
);

// data_entry only
studentsRoutes.post(
    '/upload',
    requireRole('data_entry'),
    upload.single('file'),
    parseExcel,
    uploadController,
);
studentsRoutes.patch(
    '/submit/:studentId',
    requireRole('data_entry'),
    validateAction,
    ugSubmitController,
);
studentsRoutes.post('/', requireRole('data_entry'), addStudentController);
studentsRoutes.delete(
    '/:studentId',
    requireRole('data_entry'),
    deleteStudentController,
);

export default studentsRoutes;
