import AppError from '../../../shared/utils/AppError.js';
import ROLES from '../../../constants/roles.js';

function validateChangeRole(req, res, next) {
    let role = req.body?.role;
    role = typeof role === 'string' ? role.trim() : '';
    if (!role || !Object.values(ROLES).includes(role)) {
        return next(new AppError('Please provide a valid role.', 400));
    }
    req.body.role = role;
    next();
}

export default validateChangeRole;
