function validateIdParam(req, res, next) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return next(new AppError('Invalid user id', 400));
    }
    next();
}

export default validateIdParam;
