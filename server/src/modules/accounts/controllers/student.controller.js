import studentRepo from '../repositories/student.repo.js';

async function searchStudentsController(req, res, next) {
    try {
        const batchId = req.params?.id;
        const search = req.query?.search?.trim() || '';
        const result = await studentRepo.get({ batchId, search });
        res.json(result);
    } catch (e) {
        next(e);
    }
}

export { searchStudentsController };
