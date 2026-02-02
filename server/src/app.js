import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import uploadRoute from './routes/upload.route.js';
import path from 'path';
import { fileURLToPath } from 'url';
import errorHandler from './middleware/errorHandler.middleware.js';
import jobStatusController from './controllers/jobStatus.controller.js';
import employeeRoute from './routes/employee.route.js';
import payslipsRoute from './routes/payslips.route.js';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import client from './config/redis.js';
import passport from './config/passport.js';
import authRoute from './routes/auth.route.js';
import isAuth from './middleware/isAuth.middleware.js';
import activeJobsController from './controllers/activeJobs.controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();

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

// Public Routes
app.use('/api/auth', authRoute);

app.use(isAuth);

// Protected Routes
app.use('/api/upload', uploadRoute);
app.use('/api/payslips', payslipsRoute);
app.get('/api/job-status/:id', jobStatusController);
app.get('/api/active-jobs', activeJobsController);
app.use('/api/employees/', employeeRoute);
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App running at ${port}`));
