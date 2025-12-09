import getPayslipsFromDb from '../Repositories/generatePayslipsRepository.js';
import generatePayslip from '../utils/generatePayslip.js';

async function generatePayslips(uploadId) {
    const payslips = await getPayslipsFromDb(uploadId);
    for (let i = 0; i < payslips.length; i += 30) {
        const batch = payslips.slice(i, i + 30);
        const addresses = await generatePayslip(batch);
        console.log(addresses);
    }
}

export default generatePayslips;
