import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fileRouter from './routes/fileRouter.js';

const app = express();
dotenv.config();

app.use(cors());
app.use('/file', fileRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App running at ${port}`));
