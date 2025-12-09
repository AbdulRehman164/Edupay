import { Worker } from 'bullmq';
import { queueName } from './index.js';
import generatePayslips from '../utils/generatePayslip.js';
import dotenv from 'dotenv';
dotenv.config();

const connection = { host: '127.0.0.1', port: 6379 };

const worker = new Worker(
    queueName,
    async (job) => {
        if (job.name === 'generate-for-upload') {
            const { uploadId } = job.data;
            await generatePayslips(uploadId);
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
    await worker.close();
    process.exit(0);
});
