import { payslipQueue } from '../../../queues/index.js';
import AppError from '../../../shared/utils/AppError.js';
import redis from '../../../config/redis.js';

async function jobStatusController(req, res, next) {
    try {
        const { id } = req.params;

        const job = await payslipQueue.getJob(id);

        if (!job) return res.status(404).json({ state: 'not found' });
        if (job.data.userId !== req.user.id)
            return res.status(401).json({ message: 'forbidden' });

        const state = await job.getState();
        res.json({ state });
    } catch (e) {
        next(e);
    }
}

async function activeJobsController(req, res, next) {
    try {
        const jobs = await payslipQueue.getJobs([
            'waiting',
            'active',
            'delayed',
        ]);

        const userJobs = jobs
            .filter((job) => job.data.userId === req.user.id)
            .map(async (job) => ({
                jobId: job.id,
                type: job.name,
                status: await job.getState(),
                downloadId: job.data.downloadId,
            }));

        res.json(await Promise.all(userJobs));
    } catch (e) {
        next(e);
    }
}

async function cancelJobController(req, res, next) {
    try {
        const { id } = req.params;
        const job = await payslipQueue.getJob(id);
        if (!job) {
            throw new AppError('Job not found', 404);
        }
        await redis.publish('payslip:cancel', id);
        res.status(200).json({
            message: 'Cancellation requested',
        });
    } catch (e) {
        next(e);
    }
}

export { activeJobsController, jobStatusController, cancelJobController };
