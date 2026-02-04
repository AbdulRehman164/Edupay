import AppError from '../../../shared/utils/AppError.js';
import usersRepository from '../repositories/users.repository.js';
import { getPaginatedUsers } from '../services/users.service.js';

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

export { getSingleUsersController, searchUsersController };
