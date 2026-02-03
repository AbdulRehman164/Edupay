import { Router } from 'express';
import {
    activeJobsController,
    jobStatusController,
    cancelJobController,
} from '../controllers/jobs.controller.js';

const jobRoutes = Router();

jobRoutes.get('/status/:id', jobStatusController);
jobRoutes.get('/active', activeJobsController);
jobRoutes.delete('/cancel/:id', cancelJobController);

export default jobRoutes;
