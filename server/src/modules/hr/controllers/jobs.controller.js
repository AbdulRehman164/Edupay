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
            'completed',
        ]);

        const job = jobs
            .filter(
                (job) =>
                    job.name === 'generate-for-upload' &&
                    job.data.userId === req.user.id,
            )
            .sort((a, b) => b.timestamp - a.timestamp)[0];

        if (!job) {
            return res.status(404).json({
                message: 'No job found',
            });
        }

        res.json({
            jobId: job.id,
            type: job.name,
            status: await job.getState(),
            downloadId: job.data.downloadId,
        });
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
async function completedJobsController(req, res, next) {
    try {
        const completed = await payslipQueue.getCompleted(0, 200);

        const userJobs = completed
            .filter((job) => job.data.userId === req.user.id)
            .slice(0, 10)
            .map((job) => ({
                jobId: job.id,
                type: job.name,
                status: 'completed',
                downloadId: job.data.downloadId,
                completedAt: job.finishedOn,
            }));

        res.json(userJobs);
    } catch (e) {
        next(e);
    }
}

export {
    activeJobsController,
    jobStatusController,
    cancelJobController,
    completedJobsController,
};
