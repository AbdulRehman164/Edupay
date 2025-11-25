import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import uploadRoute from './routes/uploadRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';
import errorHandler from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();

app.use(cors());
app.use('/static', express.static(path.join(__dirname, '../templates')));
app.use('/upload', uploadRoute);
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App running at ${port}`));
