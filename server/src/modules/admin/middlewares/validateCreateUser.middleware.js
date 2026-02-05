import AppError from '../../../shared/utils/AppError.js';

function validateCreateUser(req, res, next) {
    let { username, password, role } = req.body;
    username = typeof username === 'string' ? username.trim() : '';

    if (!username || !password || !role) {
        return next(
            new AppError(
                'Every user must have a username, password and a role',
                400,
            ),
        );
    }
    req.body.username = username;

    next();
}

export default validateCreateUser;
