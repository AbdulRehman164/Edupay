import employeeRepository from '../repositories/employee.repository.js';
import AppError from '../../../shared/utils/AppError.js';

async function updateEmployee(id, data) {
    const updated = await employeeRepository.updateEmployeeById(id, data);
    if (updated === 0) {
        throw new AppError('Employee not found', 400);
    }
}

export { updateEmployee };
