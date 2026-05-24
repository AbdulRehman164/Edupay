import AppError from '../../../shared/utils/AppError.js';

const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const validateUUID = (req, res, next) => {
    const uuid = req.params.uuid ?? req.params.batchId ?? req.params.id;

    if (!uuid) {
        return next(new AppError(400, 'Missing Identifier'));
    }

    if (!UUID_REGEX.test(uuid)) {
        return next(new AppError(400, 'Invalid UUID'));
    }

    next();
};

export default validateUUID;
