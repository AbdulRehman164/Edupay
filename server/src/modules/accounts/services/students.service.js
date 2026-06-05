import studentRepo from '../repositories/student.repo.js';
import assertFormationNotFinalized from './assertFormationNotFinalized.service.js';
import assertOpenBatch from './assertOpenBatch.service.js';

async function searchBatchStudents({ batchId, search, user }) {
    if (user.role === 'data_entry') {
        await assertOpenBatch(batchId);
    } else if (user.role === 'accounts') {
        await assertFormationNotFinalized(batchId);
    }
    return studentRepo.get({ batchId, search });
}
async function submitUg({ batchId, studentId, action }) {
    await assertOpenBatch(batchId);
    return studentRepo.ugSubmit({ id: studentId, action });
}

async function deleteStudent({ studentId, batchId }) {
    await assertOpenBatch(batchId);
    return studentRepo.remove(studentId);
}

async function addStudent({ data, batchId }) {
    await assertOpenBatch(batchId);
    return studentRepo.insertStudents({ data, batchId });
}

async function verifyStudentFee({ batchId, studentId, action }) {
    await assertFormationNotFinalized(batchId);
    return studentRepo.verifyFee({ id: studentId, action });
}

export default {
    searchBatchStudents,
    submitUg,
    deleteStudent,
    addStudent,
    verifyStudentFee,
};
