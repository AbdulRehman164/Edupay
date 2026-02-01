import { payslipQueue } from '../queues/index.js';

async function hasActiveJob(userId, type) {
    const jobs = await payslipQueue.getJobs(['waiting', 'active', 'delayed']);

    return jobs.some((job) => job.data.userId === userId && job.name === type);
}

export default hasActiveJob;
