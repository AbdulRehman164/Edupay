import { payslipQueue } from '../queues/index.js';

async function activeJobsController(req, res) {
    const jobs = await payslipQueue.getJobs(['waiting', 'active', 'delayed']);

    const userJobs = jobs
        .filter((job) => job.data.userId === req.user.id)
        .map(async (job) => ({
            jobId: job.id,
            type: job.name,
            status: await job.getState(),
            downloadId: job.data.downloadId,
        }));

    res.json(await Promise.all(userJobs));
}

export default activeJobsController;
