import getStats from '../services/stats.service.js';

async function statsController(req, res, next) {
    try {
        const stats = await getStats();
        res.json(stats);
    } catch (e) {
        next(e);
    }
}

export default statsController;
