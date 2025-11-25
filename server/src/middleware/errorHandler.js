function errorHandler(err, req, res, next) {
    const status = err.statusCode || 500;
    const message = err.message || 'Something broke on the server';

    res.status(status).json({
        success: false,
        error: message,
    });
}

export default errorHandler;
