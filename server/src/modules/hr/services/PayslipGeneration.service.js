import payslipRepository from '../repositories/payslip.repository.js';
import { zipFiles } from '../utils/zip.util.js';
import { renderPdf } from '../utils/pdfRenderer.util.js';
import generatePayslipTemplate from '../utils/generatePayslipTemplate.util.js';
import AppError from '../../../shared/utils/AppError.js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { payslipQueue } from '../../../queues/index.js';
import hasActiveJob from '../utils/hasActiveJob.js';

async function generatePayslipArchive(payslips, zipname, signal) {
    const outputPath = 'generated/';
    const files = [];

    await fs.promises.mkdir(outputPath, { recursive: true });

    // Ensure cleanup ALWAYS happens
    try {
        signal?.throwIfAborted();

        const template = generatePayslipTemplate(payslips[0]);

        for (let i = 0; i < payslips.length; i += 30) {
            signal?.throwIfAborted();

            const batch = payslips.slice(i, i + 30);

            for (const e of batch) {
                signal?.throwIfAborted();

                const file = await renderPdf(
                    template,
                    outputPath,
                    `${e.name}_${e.cnic_no}_${e.month}_${e.year}`,
                    signal,
                );

                files.push(file);
            }
        }

        signal?.throwIfAborted();

        await zipFiles(path.join(outputPath, zipname), files, signal);

        return zipname;
    } finally {
        await Promise.allSettled(
            files.map((file) => fs.promises.rm(file, { force: true })),
        );
    }
}

async function generateForUpload(batchId, downloadId, signal) {
    signal?.throwIfAborted();

    const payslips = await payslipRepository.getPayslipsByBatchId(batchId);

    if (payslips.length <= 0) {
        throw new AppError(
            `No data found corresponding to uploadid : ${batchId}`,
            404,
        );
    }

    signal?.throwIfAborted();

    await generatePayslipArchive(payslips, downloadId, signal);
}

async function generateForIdentifiers(identifiers, downloadId, signal) {
    signal?.throwIfAborted();
    const payslips =
        await payslipRepository.getPayslipsByIdentifiers(identifiers);

    if (payslips.length <= 0) {
        throw new AppError('No payslips found', 404);
    }

    signal?.throwIfAborted();
    await generatePayslipArchive(payslips, downloadId, signal);
}

async function queuePayslipJob(body, userId) {
    const jobType =
        body.type === 'upload'
            ? 'generate-for-upload'
            : 'generate-for-identifier';

    const alreadyRunning = await hasActiveJob(userId, jobType);

    if (alreadyRunning) {
        throw new AppError('A payslip generation is already in progress', 409);
    }

    let job;
    let downloadId;
    if (body?.type === 'upload') {
        downloadId = body?.batchId;
        job = await payslipQueue.add('generate-for-upload', {
            batchId: body?.batchId,
            downloadId,
            userId,
        });
    } else if (body?.type === 'identifier') {
        downloadId = crypto.randomUUID();
        job = await payslipQueue.add('generate-for-identifier', {
            identifiers: body?.identifiers,
            downloadId,
            userId,
        });
    } else {
        throw new AppError(`Unrecognized job type : ${body?.type}`, 400);
    }
    return { jobId: job.id, downloadId };
}

export { generateForUpload, generateForIdentifiers, queuePayslipJob };
