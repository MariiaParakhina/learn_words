import express from 'express';
import router from './router';
import morgan from 'morgan';
import cors from 'cors';
import {errorHandler} from "./modules/middleware";

const app = express();

app.use(morgan('dev'))

app.use(express.json())

app.use(express.urlencoded({extended: true}))

app.use(cors())

app.use('/api', router)

app.use(errorHandler);
export default app;