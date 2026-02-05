import AppError from '../utils/AppError.js';

function errorHandler(err, req, res, next) {
    const status = err.statusCode || 500;
    const message = err.message || 'Something broke on the server';

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(status).json({
            message: 'Invalid JSON in request body',
        });
    }

    if (err instanceof AppError) {
        return res.status(status).json({
            message: err.message,
            ...(err.details && { details: err.details }),
        });
    }

    res.status(status).json({
        message,
    });
}

export default errorHandler;
