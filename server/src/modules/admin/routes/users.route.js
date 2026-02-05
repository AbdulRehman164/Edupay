import { Router } from 'express';
import {
    getSingleUsersController,
    searchUsersController,
    createUserController,
    deleteUserController,
    editUsernameController,
} from '../controllers/users.controller.js';
import validateCreateUser from '../middlewares/validateCreateUser.middleware.js';
import validateIdParam from '../middlewares/validateIdParam.middleware.js';
import validateEditUsername from '../middlewares/validateEditUsername.middleware.js';

const usersRoutes = Router();

usersRoutes.get('/', searchUsersController);
usersRoutes.get('/:id', validateIdParam, getSingleUsersController);
usersRoutes.post('/', validateCreateUser, createUserController);
usersRoutes.delete('/:id', validateIdParam, deleteUserController);
usersRoutes.patch(
    '/:id/username',
    validateIdParam,
    validateEditUsername,
    editUsernameController,
);

export default usersRoutes;
