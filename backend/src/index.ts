import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import express, { Request, Response, NextFunction } from "express";
import { connectDB } from './config/db';
import cors from 'cors';

dotenv.config();

import userRouter from './routes/userRoutes';
import transactionRouter from './routes/transactionRoutes';
import { clerkAuthMiddleware } from './middlewares/auth';
import categoryRouter from './routes/categoryRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    console.log(req.path + " " + req.method);
    next();
})

connectDB();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cors({
    origin: ['http://localhost:5173'],
}));

app.use("/api/user", userRouter);
app.use("/api/transactions", clerkAuthMiddleware, transactionRouter);
app.use("/api/categories", clerkAuthMiddleware, categoryRouter);


app.get("/api/testauth", clerkAuthMiddleware, (req: Request, res: Response) => {
    console.log('reached inside api endpoint');
    res.json({message: "hello authenticated user"});
    console.log('message sent');
})

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