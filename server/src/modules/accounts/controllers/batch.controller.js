import batchRepo from '../repositories/batch.repo.js';

async function createBatchController(req, res, next) {
    const data = req.body;
    try {
        const result = await batchRepo.create(data);
        res.status(201).json(result);
    } catch (e) {
        next(e);
    }
}

async function searchBatchesController(req, res, next) {
    try {
        const status = req.query?.status || null;
        const search = req.query?.search?.trim() || '';
        const result = await batchRepo.search({ status, search });
        res.json(result);
    } catch (e) {
        next(e);
    }
}

async function getBatchesStatsController(req, res, next) {
    try {
        const result = await batchRepo.getStats();
        res.json(result);
    } catch (e) {
        next(e);
    }
}

export {
    createBatchController,
    searchBatchesController,
    getBatchesStatsController,
};
