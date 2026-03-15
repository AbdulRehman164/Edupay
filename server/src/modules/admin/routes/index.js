import { Router } from 'express';
import usersRoutes from './users.route.js';
import statsController from '../controllers/stats.controller.js';

const adminRoutes = Router();

adminRoutes.use('/users', usersRoutes);
adminRoutes.get('/stats', statsController);

export default adminRoutes;
