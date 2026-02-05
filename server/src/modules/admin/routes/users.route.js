import { Router } from 'express';
import {
    getSingleUsersController,
    searchUsersController,
    createUserController,
    deleteUserController,
} from '../controllers/users.controller.js';
import validateCreateUser from '../middlewares/validateCreateUser.middleware.js';

const usersRoutes = Router();

usersRoutes.get('/', searchUsersController);
usersRoutes.get('/:id', getSingleUsersController);
usersRoutes.post('/', validateCreateUser, createUserController);
usersRoutes.delete('/:id', deleteUserController);
//usersRoutes.patch('/:id', editUserController);

export default usersRoutes;
