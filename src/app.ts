import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { skinsRouter } from './routers/skins.router.js';
import createDebug from 'debug';
import { errorMiddleware } from './middleware/error.middleware.js';
import { usersRouter } from './routers/users.router.js';

const debug = createDebug('SKINS:app');

export const app = express();
debug('Starting');

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.static('public'));

app.use('/skins', skinsRouter);
app.use('/users', usersRouter);

app.use(errorMiddleware);
