import { payslipQueue } from '../queues/index.js';

async function jobStatusController(req, res) {
    const { id } = req.params;

    const job = await payslipQueue.getJob(id);

    if (!job) return res.status(404).json({ status: 'not found' });

    const state = await job.getState();
    res.json({ state });
}

export default jobStatusController;
