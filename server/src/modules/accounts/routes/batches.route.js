import { Router } from 'express';
import studentsRoutes from './students.route.js';
import requireRole from '../../../shared/middleware/requireRole.middleware.js';
import createBatchController from '../controllers/batch.controller.js';
import validateBatchPayload from '../middleware/validateBatchPayload.middleware.js';

const batchesRoutes = Router();

//batchesRoutes.get('/', searchBatchesController);
//batchesRoutes.get('/:id', getSingleBatchController);
batchesRoutes.use('/:id/students', studentsRoutes);

// data_entry only
batchesRoutes.post(
    '/',
    requireRole('data_entry'),
    validateBatchPayload,
    createBatchController,
);

export default batchesRoutes;
