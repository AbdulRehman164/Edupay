import fs from 'fs';
import payslipRepository from '../repositories/payslip.repository.js';
import AppError from '../utils/AppError.js';
import { queuePayslipJob } from '../services/PayslipGeneration.service.js';

async function fileDownloadController(req, res) {
    const { id } = req.params;
    const filePath = `generated/${id}`;
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=${id}`);
    const stream = fs.createReadStream(filePath);
    stream.on('error', () => res.sendStatus(404));
    stream.pipe(res);
}

async function searchPayslipsController(req, res) {
    const { cnic } = req.query;
    if (!cnic) {
        res.status(400).send({ error: 'No query is provided' });
        return;
    }
    const result = await payslipRepository.getPayslipsByCnic(cnic);
    if (result.length === 0) {
        throw new AppError('No payslips found', 404);
    }
    res.json(result);
}

async function generatePayslipsController(req, res, next) {
    try {
        const body = req.body;
        const result = await queuePayslipJob(body, req.user.id);
        res.status(202).json({
            message: 'Queued',
            jobId: result?.jobId,
            downloadId: result?.downloadId,
        });
    } catch (e) {
        next(e);
    }
}

export {
    fileDownloadController,
    generatePayslipsController,
    searchPayslipsController,
};
