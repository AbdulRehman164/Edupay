import batchRepo from '../repositories/batch.repo.js';
import batchServices from '../services/batch.service.js';

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
        const search = req.query?.search?.trim() || '';
        const status = req.query?.status?.trim() || '';
        const formation_finalized =
            req.query?.formation_finalized?.trim() || '';
        const result = await batchRepo.search({
            search,
            status,
            formation_finalized,
        });
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

async function closeBatchController(req, res, next) {
    try {
        const id = req.params?.id;
        const result = await batchRepo.closeBatch(id);
        res.json(`${result} batch closed.`);
    } catch (e) {
        next(e);
    }
}
async function downloadFormationController(req, res, next) {
    try {
        const id = req.params?.id;
        const { buffer, batch } =
            await batchServices.generateClassFormationSheet(id);
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${batch.department}-${batch.semester}-${batch.section}-${batch.year}.xlsx"`,
        );
        res.send(buffer);
    } catch (e) {
        next(e);
    }
}

async function finalizeFormationController(req, res, next) {
    try {
        const id = req.params?.id;
        const result = await batchServices.finalizeFormation(id);
        res.json(`${result} formation finalized.`);
    } catch (e) {
        next(e);
    }
}

export {
    createBatchController,
    searchBatchesController,
    getBatchesStatsController,
    closeBatchController,
    downloadFormationController,
    finalizeFormationController,
};
