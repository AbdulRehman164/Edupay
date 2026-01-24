import { Worker } from 'bullmq';
import { queueName } from './index.js';
import dotenv from 'dotenv';
import {
    generateForUpload,
    generateForIdentifiers,
} from '../services/PayslipGeneration.service.js';
dotenv.config();

const connection = { host: '127.0.0.1', port: 6379 };

const worker = new Worker(
    queueName,
    async (job) => {
        if (job.name === 'generate-for-upload') {
            const { uploadId, downloadId } = job.data;
            await generateForUpload(uploadId, downloadId);
        } else if (job.name === 'generate-for-identifier') {
            const { identifiers, downloadId } = job.data;
            await generateForIdentifiers(identifiers, downloadId);
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
