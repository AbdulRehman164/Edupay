import batchRepo from '../repositories/batch.repo.js';
import AppError from '../../../shared/utils/AppError.js';

async function assertFormationNotFinalized(id) {
    const batch = await batchRepo.getById(id);
    if (!batch) throw new AppError('Batch not found.', 404);
    if (batch.formation_finalized)
        throw new AppError('The formation is finalized', 400);
    return batch;
}

export default assertFormationNotFinalized;
