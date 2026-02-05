import AppError from '../../../shared/utils/AppError.js';

async function validateDeleteUser(req, res, next) {
    const { id } = req.params;
    if (!id) {
        next(new AppError('Missing user id', 401));
    }
    next();
}

export default validateDeleteUser;
