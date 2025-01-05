import express from 'express';
import router from './router';
import morgan from 'morgan';
import cors from 'cors';
import { errorHandler } from './modules/middleware';

const app = express();

app.use(morgan('dev'));
app.use(express.json());

const corsOptions = {
    origin: '*', // Your frontend URL
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions)); // Apply CORS options here

app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.use(errorHandler);

export default app;