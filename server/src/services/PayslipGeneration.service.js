import payslipRepository from '../repositories/payslip.repository.js';
import { zipFiles } from '../utils/zip.util.js';
import { renderPdf, closeBrowser } from '../utils/pdfRenderer.util.js';
import generatePayslipTemplate from '../utils/generatePayslipTemplate.util.js';
import AppError from '../utils/AppError.js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

async function generatePayslipArchive(payslips, zipname) {
    const outputPath = 'generated/';
    let files = [];

    await fs.promises.mkdir(outputPath, { recursive: true });

    const template = generatePayslipTemplate(payslips[0]);

    for (let i = 0; i < payslips.length; i += 30) {
        const batch = payslips.slice(i, i + 30);

        for (const e of batch) {
            files.push(
                await renderPdf(
                    template,
                    outputPath,
                    `${e?.name}_${e?.cnic_no}_${e?.month}_${e?.year}`,
                ),
            );
        }
    }

    await zipFiles(path.join(outputPath, zipname), files);
    for (const file of files) {
        await fs.promises.rm(file, { force: true });
    }
    return zipname;
}

async function generateForUpload(uploadId, downloadId) {
    const payslips = await payslipRepository.getPayslipsByUploadId(uploadId);
    if (payslips.length <= 0) {
        throw new AppError(
            `No data found corresponding to uploadid : ${uploadId}`,
            404,
        );
    }
    await generatePayslipArchive(payslips, downloadId);
}

async function generateForIdentifiers(identifiers, downloadId) {
    const payslips =
        await payslipRepository.getPayslipsByIdentifiers(identifiers);

    if (payslips.length <= 0) {
        throw new AppError('No payslips found', 404);
    }
    await generatePayslipArchive(payslips, downloadId);
}

export { generateForUpload, generateForIdentifiers };
