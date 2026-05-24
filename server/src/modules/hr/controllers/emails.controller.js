import fs from 'fs/promises';
import path from 'path';
import { getBatchEmailStatus } from '../repositories/payslipEmail.repository.js';
import { retryFailedBatchEmails } from '../services/payslipEmail.service.js';

import { payslipQueue } from '../../../queues/index.js';

async function sendEmailsController(req, res, next) {
    try {
        const { batchId } = req.params;

        const pdfDirectoryPath = path.join(
            process.cwd(),
            `generated/${batchId}/pdfs`,
        );

        await fs.access(pdfDirectoryPath);

        const job = await payslipQueue.add('send-emails', {
            batchId,
            pdfDirectoryPath,
        });

        return res.status(200).json({
            message: 'Email job queued successfully',
            jobId: job.id,
        });
    } catch (err) {
        if (err.code === 'ENOENT') {
            return res.status(404).json({
                error: 'Payslip batch not found',
            });
        }

        next(err);
    }
}
async function getBatchEmailStatusController(req, res, next) {
    try {
        const batchId = req.params.batchId;

        if (!batchId) {
            return res.status(400).json({
                message: 'Invalid batch id',
            });
        }

        const data = await getBatchEmailStatus(batchId);

        return res.json(data);
    } catch (err) {
        next(err);
    }
}
export async function retryBatchEmailsController(req, res, next) {
    try {
        const batchId = req.params.batchId;

        if (!batchId) {
            return res.status(400).json({
                message: 'Invalid batch id',
            });
        }

        const retried = await retryFailedBatchEmails(batchId);

        return res.json({
            message: 'Retry queued',
            retried,
        });
    } catch (err) {
        next(err);
    }
}

export { sendEmailsController, getBatchEmailStatusController };
