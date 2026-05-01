import studentRepo from '../repositories/student.repo.js';

async function uploadController(req, res, next) {
    try {
        const data = req.parsedData;
        const batchId = req.params.id;
        const result = await studentRepo.insertStudents({ data, batchId });
        res.json(result);
    } catch (e) {
        next(e);
    }
}

export default uploadController;
