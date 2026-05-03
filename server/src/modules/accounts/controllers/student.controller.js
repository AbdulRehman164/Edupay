import studentRepo from '../repositories/student.repo.js';
import studentsServices from '../services/students.service.js';

async function searchStudentsController(req, res, next) {
    try {
        const batchId = req.params?.id;
        const search = req.query?.search?.trim() || '';
        const result = await studentsServices.searchBatchStudents({
            batchId,
            search,
        });
        res.json(result);
    } catch (e) {
        next(e);
    }
}

async function ugSubmitController(req, res, next) {
    try {
        const studentId = req.params?.studentId;
        const batchId = req.params?.id;
        const action = req.query.action;
        const result = await studentsServices.submitUg({
            studentId,
            action,
            batchId,
        });
        res.json(`Updated ${result} student`);
    } catch (e) {
        next(e);
    }
}

async function deleteStudentController(req, res, next) {
    try {
        const studentId = req.params?.studentId;
        const batchId = req.params?.id;
        const result = await studentsServices.deleteStudent({
            studentId,
            batchId,
        });
        res.json(`Deleted ${result} student`);
    } catch (e) {
        next(e);
    }
}

async function addStudentController(req, res, next) {
    try {
        const data = [req.body];
        const batchId = req.params.id;
        const result = await studentsServices.addStudent({ data, batchId });
        res.json(result);
    } catch (e) {
        next(e);
    }
}

async function uploadController(req, res, next) {
    try {
        const data = req.parsedData;
        const batchId = req.params.id;
        const result = await studentsServices.addStudent({ data, batchId });
        res.json(result);
    } catch (e) {
        next(e);
    }
}
async function feeVerifyController(req, res, next) {
    try {
        const studentId = req.params?.studentId;
        const batchId = req.params?.id;
        const action = req.query.action;
        const result = await studentsServices.verifyStudentFee({
            batchId,
            studentId,
            action,
        });
        res.json(`${result} student fee verfied.`);
    } catch (e) {
        next(e);
    }
}

export {
    searchStudentsController,
    ugSubmitController,
    deleteStudentController,
    addStudentController,
    uploadController,
    feeVerifyController,
};
