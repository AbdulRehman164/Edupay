import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import pool from './db.js';

passport.use(
    new LocalStrategy(
        { usernameField: 'username' },
        async (username, password, done) => {
            try {
                const result = await pool.query(
                    'SELECT id,username,password,role FROM users where username=$1',
                    [username],
                );
                if (result.rows.length === 0) {
                    return done(null, false);
                }
                const user = result.rows[0];
                const match = await bcrypt.compare(password, user.password);

                if (!match) {
                    return done(null, false, { message: 'Wrong password' });
                }
                const { password: psd, ...safeUser } = user;
                return done(null, safeUser);
            } catch (err) {
                return done(err);
            }
        },
    ),
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const result = await pool.query(
            'SELECT id, username, role  FROM users WHERE id = $1',
            [id],
        );
        if (result.rows.length === 0) {
            done(null, false);
        }
        done(null, result.rows[0]);
    } catch (err) {
        done(err);
    }
});

export default passport;
