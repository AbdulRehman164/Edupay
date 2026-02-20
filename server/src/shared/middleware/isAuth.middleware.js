function isAuth(req, res, next) {
    if (!req.isAuthenticated() || !req.user) {
        req.logout(() => {});
        return res.status(401).json({ message: 'Not Authenticated' });
    }

    if (!req.user) {
        return req.session.destroy(() => {
            res.status(401).json({ message: 'Session invalid' });
        });
    }

    next();
}

export default isAuth;
