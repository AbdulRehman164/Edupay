import { Queue } from 'bullmq';

export const queueName = 'generate-payslips';

const connection = { host: '127.0.0.1', port: 6379 };

export const payslipQueue = new Queue(queueName, {
    connection,
    defaultJobOptions: {
        removeOnComplete: 10,
        removeOnFail: {
            age: 24 * 60 * 60,
        },
    },
});
