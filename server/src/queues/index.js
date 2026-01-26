import { Queue } from 'bullmq';

export const queueName = 'generate-payslips';

const connection = { host: '127.0.0.1', port: 6379 };

export const payslipQueue = new Queue(queueName, {
    connection,
    defaultJobOptions: {
        removeOnComplete: {
            age: 60 * 60,
            count: 1000,
        },
        removeOnFail: {
            age: 24 * 60 * 60,
        },
    },
});
