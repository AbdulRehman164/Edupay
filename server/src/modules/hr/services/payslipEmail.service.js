import fs from 'fs';
import path from 'path';

import { payslipQueue } from '../../../queues/index.js';

import { Resend } from 'resend';

import {
    markEmailSent,
    resetEmailToPending,
} from '../repositories/payslipEmail.repository.js';

import {
    getBatchEmployees,
    upsertPendingEmailLog,
    getFailedBatchEmployees,
} from '../repositories/payslipEmail.repository.js';

async function sendEmails(batchId, pdfDirectoryPath, signal) {
    signal?.throwIfAborted();

    // ensure directory exists
    await fs.promises.access(pdfDirectoryPath);

    const employees = await getBatchEmployees(batchId);

    let queued = 0;

    for (const employee of employees) {
        signal?.throwIfAborted();

        const filename = `${employee.name}_${employee.cnic_no}_${employee.month}_${employee.year}.pdf`;

        const pdfPath = path.join(pdfDirectoryPath, filename);

        // ensure pdf exists
        try {
            await fs.promises.access(pdfPath);
        } catch {
            console.log(`Missing PDF for employee ${employee.employee_id}`);

            continue;
        }

        await upsertPendingEmailLog(batchId, employee.employee_id);

        await payslipQueue.add(
            'send-single-email',
            {
                batchId,
                employeeId: employee.employee_id,
                employeeName: employee.name,
                email: employee.email,
                filename,
                pdfPath,
            },
            {
                attempts: 3,

                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
            },
        );

        queued++;
    }

    return {
        queued,
    };
}

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendSingleEmail(jobData, signal) {
    signal?.throwIfAborted();

    const { batchId, employeeId, employeeName, email, filename, pdfPath } =
        jobData;

    // ensure pdf exists
    await fs.promises.access(pdfPath);

    signal?.throwIfAborted();

    const pdfBuffer = await fs.promises.readFile(pdfPath);

    signal?.throwIfAborted();

    const { data, error } = await resend.emails.send({
        from: process.env.MAIL_FROM || 'onboarding@resend.dev',

        to: email,

        subject: 'Payslip',

        html: `
            <p>Dear ${employeeName},</p>

            <p>
                Your payslip is attached.
            </p>
        `,

        attachments: [
            {
                filename,
                content: pdfBuffer,
            },
        ],
    });
    if (error) {
        throw new Error(error.message || 'Failed to send email');
    }

    signal?.throwIfAborted();

    await markEmailSent(batchId, employeeId);

    console.log(`Payslip sent to ${email}`);
}
async function retryFailedBatchEmails(batchId) {
    const failedEmployees = await getFailedBatchEmployees(batchId);

    let retried = 0;

    for (const employee of failedEmployees) {
        const filename = `${employee.name}_${employee.cnic_no}_${employee.month}_${employee.year}.pdf`;

        const pdfPath = path.join('generated', batchId, 'pdfs', filename);

        // reset DB status first
        await resetEmailToPending(batchId, employee.employee_id);

        await payslipQueue.add(
            'send-single-email',
            {
                batchId,
                employeeId: employee.employee_id,
                employeeName: employee.name,
                email: employee.email,
                filename,
                pdfPath,
            },
            {
                attempts: 3,

                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
            },
        );

        retried++;
    }

    return retried;
}

export { retryFailedBatchEmails, sendEmails, sendSingleEmail };
