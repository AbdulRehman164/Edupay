import ROLES from '../../../constants/roles.js';
import AppError from '../../../shared/utils/AppError.js';
import usersRepository from '../repositories/users.repository.js';
import hashPassword from '../utils/hashPassword.util.js';

async function getPaginatedUsers(search, page, limit) {
    const offset = (page - 1) * limit;

    const users = await usersRepository.searchUsers(search, limit, offset);
    const count = await usersRepository.countUsers(search);
    return { users, page, totalPages: Math.ceil(count / limit) };
}

async function createUser(username, password, role) {
    if (!Object.values(ROLES).includes(role)) {
        throw new AppError('Invalid role assigned.', 400);
    }

    const hashedPass = await hashPassword(password);
    try {
        const result = await usersRepository.create({
            username,
            password: hashedPass,
            role,
        });
        const { password: _, ...userWithoutpassword } = result;
        return userWithoutpassword;
    } catch (e) {
        if (e.code === '23505') {
            throw new AppError('Username already exists.', 400);
        }
        throw e;
    }
}

export { getPaginatedUsers, createUser };
