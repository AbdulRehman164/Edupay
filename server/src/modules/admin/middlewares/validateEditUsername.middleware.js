import AppError from '../../../shared/utils/AppError.js';

function validateEditUsername(req, res, next) {
    let username = req.body?.username;
    username = typeof username === 'string' ? username.trim() : '';
    if (!username) {
        return next(new AppError('Please provide a valid username.', 400));
    }
    req.body.username = username;
    next();
}

export default validateEditUsername;
