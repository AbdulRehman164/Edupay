import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.post('/login', (req, res, next) => {
    const cb = (err, user, info) => {
        if (err) {
            next(err);
        }
        if (!user) return res.status(401).json({ message: info?.message });
        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.json(user);
        });
    };

    passport.authenticate('local', cb)(req, res, next);
});

router.post('/logout', (req, res) => {
    req.logout(() => {
        res.json({ message: 'Logged out' });
    });
});

router.get('/me', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not Authenticated' });
    }
    res.json(req.user);
});

export default router;
