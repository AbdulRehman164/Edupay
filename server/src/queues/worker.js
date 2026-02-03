import { Worker, UnrecoverableError } from 'bullmq';
import { queueName } from './index.js';
import dotenv from 'dotenv';
import {
    generateForUpload,
    generateForIdentifiers,
} from '../modules/hr/services/PayslipGeneration.service.js';
import { closeBrowser } from '../modules/hr/utils/pdfRenderer.util.js';
import redis from '../config/redis.js';
dotenv.config();

const connection = { host: '127.0.0.1', port: 6379 };

const worker = new Worker(
    queueName,
    async (job, token, signal) => {
        signal?.addEventListener('abort', async () => {
            console.log(`Job ${job.id} cancelled`);
            await closeBrowser();
        });
        if (job.name === 'generate-for-upload') {
            const { batchId, downloadId } = job.data;
            await generateForUpload(batchId, downloadId, signal);
        } else if (job.name === 'generate-for-identifier') {
            const { identifiers, downloadId } = job.data;
            await generateForIdentifiers(identifiers, downloadId, signal);
        }
    },
    { connection, concurrency: 2 },
);

worker.on('completed', (job) => {
    console.log('Job done:', job.id);
});

worker.on('failed', (job, err) => {
    console.error('Job failed:', job.id, err);
});

process.on('SIGINT', async () => {
    console.log('Shutting down worker...');
    await worker.close(); // stop BullMQ
    await closeBrowser(); // close Chromium
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Shutting down worker...');
    await worker.close();
    await closeBrowser();
    process.exit(0);
});

redis.subscribe('payslip:cancel', (jobId) => {
    const cancelled = worker.cancelJob(jobId, 'User cancelled from UI');

    if (cancelled) {
        console.log(`Job ${jobId} cancellation sent`);
    } else {
        console.log(`Job ${jobId} was not active`);
    }
});
