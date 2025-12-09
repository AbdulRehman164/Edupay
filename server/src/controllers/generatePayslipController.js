import { payslipQueue } from '../queues/index.js';

async function generatePayslipController(req, res) {
    const { uploadId } = req.body;
    const job = await payslipQueue.add('generate-for-upload', { uploadId });
    res.status(202).json({ message: 'Queued', jobId: job.id });
}

export default generatePayslipController;
