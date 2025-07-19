import { clerkWebhook } from "../controllers/webhook";
const express = require('express');

const userRouter = express.Router();

//login
userRouter.post("/webhooks", express.raw({ type: 'application/json' }), clerkWebhook)

export default userRouter;