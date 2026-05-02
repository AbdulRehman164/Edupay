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

async function ugSubmitController(req, res, next) {
    try {
        const id = req.params?.studentId;
        const action = req.query.submit;
        const result = await studentRepo.ugSubmit({ id, action });
        res.json(`Updated ${result} student`);
    } catch (e) {
        next(e);
    }
}

async function deleteStudentController(req, res, next) {
    try {
        const id = req.params?.studentId;
        const result = await studentRepo.remove(id);
        res.json(`Deleted ${result} student`);
    } catch (e) {
        next(e);
    }
}

async function addStudentController(req, res, next) {
    try {
        const data = [req.body];
        const batchId = req.params.id;
        const result = await studentRepo.insertStudents({ data, batchId });
        res.json(result);
    } catch (e) {
        next(e);
    }
}

export {
    searchStudentsController,
    ugSubmitController,
    deleteStudentController,
    addStudentController,
};
