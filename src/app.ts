import express from 'express';
import cors from 'cors';

import userController from './modules/users/controller/user.controller.ts'

const app = express();

app.use(cors());
app.use(express.json());

// Роутеры

app.use('/user/services', userController)

export default app;