import AppError from '../../../shared/utils/AppError.js';
import usersRepository from '../repositories/users.repository.js';
import { getPaginatedUsers, createUser } from '../services/users.service.js';

async function searchUsersController(req, res, next) {
    try {
        const page = parseInt(req.query?.page) || 1;
        const limit = parseInt(req.query?.limit) || 15;
        const search = req.query?.search?.trim() || '';
        const result = await getPaginatedUsers(search, page, limit);
        res.json(result);
    } catch (e) {
        next(e);
    }
}

async function getSingleUsersController(req, res, next) {
    try {
        const { id } = req.params;
        const user = await usersRepository.getUserById(id);
        if (!user) {
            throw new AppError('User not found.', 404);
        }
        res.json({ user });
    } catch (e) {
        next(e);
    }
}

async function createUserController(req, res, next) {
    try {
        const { username, password, role } = req.body;
        const result = await createUser(username?.trim(), password, role);
        res.json(result);
    } catch (e) {
        next(e);
    }
}
async function deleteUserController(req, res, next) {
    try {
        const { id } = req.params;
        const user = await usersRepository.remove(id);
        if (!user) {
            throw new AppError('User not found.', 401);
        }
        res.json({ message: 'User deleted sucessfully.' });
    } catch (e) {
        next(e);
    }
}

export {
    getSingleUsersController,
    searchUsersController,
    createUserController,
    deleteUserController,
};
