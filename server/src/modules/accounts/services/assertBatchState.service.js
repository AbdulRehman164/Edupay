import batchRepo from '../repositories/batch.repo.js';
import AppError from '../../../shared/utils/AppError.js';

async function assertBatchState(id, state) {
    const batch = await batchRepo.getById(id);
    if (!batch) throw new AppError('Batch not found.', 404);
    if (batch.status !== state)
        throw new AppError(`This batch is ${state}.`, 400);
    return batch;
}

export default assertBatchState;
