import AppError from '../../../shared/utils/AppError.js';

async function validateAction(req, res, next) {
    const action = req.query?.action;
    if (!action) {
        return next(new AppError('Missing action.', 400));
    }
    if (action.toLowerCase() !== 'true' && action.toLowerCase() !== 'false') {
        return next(
            new AppError(
                'Invalid action. Action should be true or false.',
                400,
            ),
        );
    }
    next();
}

export default validateAction;
