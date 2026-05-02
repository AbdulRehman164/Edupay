import { Router } from 'express';
import requireRole from '../../../shared/middleware/requireRole.middleware.js';
import parseExcel from '../../../shared/middleware/parseExcel.middleware.js';
import {
    searchStudentsController,
    ugSubmitController,
    deleteStudentController,
    addStudentController,
    uploadController,
} from '../controllers/student.controller.js';
import upload from '../middleware/upload.middleware.js';
import validateSubmitAction from '../middleware/validateSubmitAction.js';

const studentsRoutes = Router({ mergeParams: true });

studentsRoutes.get('/', searchStudentsController);

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
    validateSubmitAction,
    ugSubmitController,
);
studentsRoutes.post('/', requireRole('data_entry'), addStudentController);
studentsRoutes.delete(
    '/:studentId',
    requireRole('data_entry'),
    deleteStudentController,
);

export default studentsRoutes;
