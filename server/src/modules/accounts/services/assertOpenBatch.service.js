import batchRepo from '../repositories/batch.repo.js';
import AppError from '../../../shared/utils/AppError.js';

async function assertOpenBatch(id) {
    const batch = await batchRepo.getById(id);
    if (!batch) throw new AppError('Batch not found.', 404);
    if (batch.status !== 'open')
        throw new AppError('This batch is closed.', 400);
    return batch;
}

export default assertOpenBatch;
