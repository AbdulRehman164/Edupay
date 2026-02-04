import { Router } from 'express';
import usersRoutes from './users.route.js';

const adminRoutes = Router();

adminRoutes.use('/users', usersRoutes);

export default adminRoutes;
