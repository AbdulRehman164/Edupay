import { Router } from 'express';
import {
    getSingleUsersController,
    searchUsersController,
} from '../controllers/users.controller.js';

const usersRoutes = Router();

usersRoutes.get('/', searchUsersController);
usersRoutes.get('/:id', getSingleUsersController); //completed
//usersRoutes.post('/', createUserController);
//usersRoutes.delete('/:id', deleteUserController);
//usersRoutes.patch('/:id', editUserController);

export default usersRoutes;
