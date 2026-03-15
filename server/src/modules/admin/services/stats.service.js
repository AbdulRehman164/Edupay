import statsRepostiry from '../repositories/stats.repository.js';

async function getStats() {
    const rows = await statsRepostiry.getUsersCount();
    const users = { total: 0, roles: {} };
    for (const row of rows) {
        const count = Number(row.count);
        users.total += count;
        users.roles[row.role] = count;
    }
    return { users };
}

export default getStats;
