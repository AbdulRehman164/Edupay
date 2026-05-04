import { Router } from 'express';
import studentsRoutes from './students.route.js';
import requireRole from '../../../shared/middleware/requireRole.middleware.js';
import {
    createBatchController,
    searchBatchesController,
    getBatchesStatsController,
    closeBatchController,
    downloadFormationController,
} from '../controllers/batch.controller.js';
import validateBatchPayload from '../middleware/validateBatchPayload.middleware.js';

const batchesRoutes = Router();

//batchesRoutes.get('/:id', getSingleBatchController);
batchesRoutes.use('/:id/students', studentsRoutes);

batchesRoutes.get('/', searchBatchesController);
batchesRoutes.get('/stats', getBatchesStatsController);

batchesRoutes.get('/:id/download-formation', downloadFormationController);

// data_entry only
batchesRoutes.post(
    '/',
    requireRole('data_entry'),
    validateBatchPayload,
    createBatchController,
);

batchesRoutes.patch(
    '/:id/close',
    requireRole('data_entry'),
    closeBatchController,
);

export default batchesRoutes;
