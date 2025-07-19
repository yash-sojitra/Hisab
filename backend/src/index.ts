import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import express from 'express';
import { connectDB } from './config/db';

import userRouter from './routes/userRoutes';

dotenv.config();

import { Request, Response, NextFunction } from "express";

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
// app.use(express.json())

app.use("/api/user", userRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(req.path + " " + req.method);
    next()
})

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript with Express! 👋');
  });

app.listen(process.env.PORT, function () {
    console.log(`connected to db and server started at port ${process.env.PORT}`)
})