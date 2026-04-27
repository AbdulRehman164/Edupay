import studentRepo from '../repositories/student.repo.js';

async function searchStudentsController(req, res, next) {
    try {
        const batchId = req.params?.id;
        const result = await studentRepo.get(batchId);
        res.json(result);
    } catch (e) {
        next(e);
    }
}

export { searchStudentsController };
