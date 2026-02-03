import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import errorHandler from './shared/middleware/errorHandler.middleware.js';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import client from './config/redis.js';
import passport from './config/passport.js';
import authRoute from './auth/auth.route.js';
import isAuth from './shared/middleware/isAuth.middleware.js';
import hrRoutes from './modules/hr/routes/index.js';
import requireRole from './shared/middleware/requireRole.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const store = new RedisStore({ client, prefix: 'sess:' });

app.use(
    session({
        store: store,
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 24 hour
            httpOnly: true,
            secure: false,
        },
    }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/static', express.static(path.join(__dirname, '../templates')));

/*************************** Public Routes ***************************/
app.use('/api/auth', authRoute);

app.use(isAuth);

/*************************** Protected Routes ***************************/

//hr
app.use('/api/hr', requireRole('hr'), hrRoutes);

//admin
// admin routes here

app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App running at ${port}`));
