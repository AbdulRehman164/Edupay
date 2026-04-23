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

export default createBatchController;
