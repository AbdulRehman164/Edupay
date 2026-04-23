import { Router } from 'express';
import batchesRoutes from './batches.route.js';

const accountRoutes = Router();

accountRoutes.use('/batches', batchesRoutes);

export default accountRoutes;
