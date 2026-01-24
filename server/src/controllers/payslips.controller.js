import fs from 'fs';
import payslipRepository from '../repositories/payslip.repository.js';
import AppError from '../utils/AppError.js';
import { payslipQueue } from '../queues/index.js';
import crypto from 'crypto';

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

async function generatePayslipsController(req, res) {
    const body = req.body;
    let job;
    let downloadId;
    if (body?.type === 'upload') {
        downloadId = body?.uploadId;
        job = await payslipQueue.add('generate-for-upload', {
            uploadId: body?.uploadId,
            downloadId,
        });
    } else if (body?.type === 'identifier') {
        downloadId = crypto.randomUUID();
        job = await payslipQueue.add('generate-for-identifier', {
            identifiers: body?.identifiers,
            downloadId,
        });
    } else {
        throw new AppError(`Unrecognized job type : ${body?.type}`, 400);
    }
    res.status(202).json({ message: 'Queued', jobId: job.id, downloadId });
}

export {
    fileDownloadController,
    generatePayslipsController,
    searchPayslipsController,
};
