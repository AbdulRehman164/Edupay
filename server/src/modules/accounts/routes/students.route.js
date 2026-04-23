import { Router } from 'express';
import requireRole from '../../../shared/middleware/requireRole.middleware.js';
import parseExcel from '../../../shared/middleware/parseExcel.middleware.js';
import uploadController from '../controllers/upload.controller.js';

const studentsRoutes = Router();

//studentsRoutes.get('/', searchStudentsController);

// data_entry only
//studentsRoutes.post(
//    '/upload',
//    requireRole('data_entry'),
//    upload.single('file'),
//    parseExcel,
//    uploadController,
//);
//studentsRoutes.post('/', requireRole('data_entry'), addStudentController);
//studentsRoutes.delete(
//    '/:studentId',
//    requireRole('data_entry'),
//    deleteStudentController,
//);

export default studentsRoutes;
