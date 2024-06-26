import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import session from 'express-session';
import { fileURLToPath } from 'url';

import fs from 'fs';
import path from 'path';
import { config } from "dotenv";
import ErrorHandler from './classes/errorHandler.js';

const errorHandler = new ErrorHandler();

config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/debug.log'), { flags: 'a' });

const app = express();

const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, { stream: accessLogStream }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use(session({
    secret: 'mySecretKey', //! Change later
    resave: false,
    saveUninitialized: false
}));

app.get('/', (req, res) => {
    try {
        return res.status(200).json({ message: 'works' });
    } catch (error) {
        errorHandler.logToError(error, req)
        res.status(500).json('Internal server error');
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});