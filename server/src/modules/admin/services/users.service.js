import usersRepository from '../repositories/users.repository.js';

async function getPaginatedUsers(search, page, limit) {
    const offset = (page - 1) * limit;

    const users = await usersRepository.searchUsers(search, limit, offset);
    const count = await usersRepository.countUsers(search);
    return { users, page, totalPages: Math.ceil(count / limit) };
}

export { getPaginatedUsers };
