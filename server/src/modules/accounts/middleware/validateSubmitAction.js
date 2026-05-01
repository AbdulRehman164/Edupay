import AppError from '../../../shared/utils/AppError.js';

async function validateSubmitAction(req, res, next) {
    const action = req.query?.submit;
    if (!action) {
        return next(new AppError('Missing submit action.', 400));
    }
    if (action.toLowerCase() !== 'true' && action.toLowerCase() !== 'false') {
        return next(
            new AppError(
                'Invalid submit action. Action should be true or false.',
                400,
            ),
        );
    }
    next();
}

export default validateSubmitAction;
