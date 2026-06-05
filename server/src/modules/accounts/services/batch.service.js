import XLSX from 'xlsx';
import batchRepo from '../repositories/batch.repo.js';
import AppError from '../../../shared/utils/AppError.js';
import assertBatchState from './assertBatchState.service.js';

async function generateClassFormationSheet(batchId) {
    const [students, batch] = await Promise.all([
        batchRepo.getEligibleStudentsByBatch(batchId),
        batchRepo.getById(batchId),
    ]);

    if (!students.length) {
        throw new AppError('No eligible students found for this batch', 404);
    }

    const data = students.map((s) => ({
        'Registration No.': s.reg_number,
        Name: s.name,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    worksheet['!cols'] = [
        { wch: 20 }, // Registration No.
        { wch: 30 }, // Name
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Class Formation');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    return { buffer, batch };
}

async function finalizeFormation(id) {
    await assertBatchState(id, 'close');
    const result = await batchRepo.finalizeFormation(id);
    return result;
}

export default { generateClassFormationSheet, finalizeFormation };
