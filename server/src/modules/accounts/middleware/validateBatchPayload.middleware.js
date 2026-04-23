import AppError from '../../../shared/utils/AppError.js';

const validateBatchPayload = (req, res, next) => {
    const { semester, department, year, section } = req.body;

    const missing = [];
    if (!semester) missing.push('semester');
    if (!department) missing.push('department');
    if (!year) missing.push('year');
    if (!section) missing.push('section');

    if (missing.length > 0) {
        return next(
            new AppError('Missing required fields', 400, { fields: missing }),
        );
    }

    if (typeof department !== 'string') {
        return next(new AppError('Invalid deparment', 400));
    }

    const validSemesters = [1, 2, 3, 4, 5, 6, 7, 8];
    if (!validSemesters.includes(Number(semester))) {
        return next(
            new AppError(
                'Invalid semester. Semester Must be a number between 1 and 8',
                400,
            ),
        );
    }

    const validSections = ['morning', 'evening'];
    if (!validSections.includes(section.toLowerCase())) {
        return next(
            new AppError(
                `Invalid section. Section must be one of: ${validSections.join(', ')}`,
                400,
            ),
        );
    }

    const currentYear = new Date().getFullYear();
    const parsedYear = parseInt(year);
    if (
        isNaN(parsedYear) ||
        parsedYear < 2000 ||
        parsedYear > currentYear + 1
    ) {
        return next(
            new AppError(
                `Invalid year. Year must be a number between 2000 and ${currentYear + 1}`,
                400,
            ),
        );
    }

    req.body.section = section.toLowerCase();
    req.body.department = department.toLowerCase();
    req.body.semester = Number(semester);
    req.body.year = parseInt(year);
    req.body.created_by = req.user.id;

    next();
};

export default validateBatchPayload;
