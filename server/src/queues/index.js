import { Queue } from 'bullmq';

export const queueName = 'generate-payslips';

// basic connection - change host/port/password for your env
const connection = { host: '127.0.0.1', port: 6379 };

export const payslipQueue = new Queue(queueName, { connection });
