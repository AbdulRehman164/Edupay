function isAuth(req, res, next) {
    if (!req.isAuthenticated() || !req.user) {
        req.logout(() => {});
        return res.status(401).json({ message: 'Not Authenticated' });
    }

    return next();
}

export default isAuth;
