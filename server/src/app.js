import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import uploadRoute from './routes/uploadRoute.js';
import pool from './middleware/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();

app.use(cors());

app.use('/static', express.static(path.join(__dirname, '../templates')));

app.get('/', async (req, res) => {
    const result = await pool.query('SELECT * FROM employees');
    console.log(result.rows);
    res.send(result.rows);
});
app.use('/upload', uploadRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App running at ${port}`));
