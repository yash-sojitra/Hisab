import { UserJSON, WebhookEvent } from "@clerk/clerk-sdk-node";
import { Request, Response } from "express";
import { Webhook } from "svix";
import {User} from "../models/user";
import { Category } from "../models/category";

//webhook by clerk sync our user database with theirs
export const clerkWebhook = async (req: Request, res: Response) => {

    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

    if (!WEBHOOK_SECRET) {
        console.error("Webhook secret is not configured.");
        return res.status(500).send('Internal Server Error');
    }

    const svix_id = req.headers['svix-id'] as string;
    const svix_timestamp = req.headers['svix-timestamp'] as string;
    const svix_signature = req.headers['svix-signature'] as string;

    if (!svix_id || !svix_timestamp || !svix_signature) {
        console.error("Bad Request");
        return res.status(400).send('Error: Missing svix headers');
    }

    const payload = req.body;
    const bodyString = payload.toString();
    
    // Verifying the webhook signature
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    try {
        evt = wh.verify(bodyString, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent;
    } catch (err: any) {
        console.error('Error verifying webhook:', err.message);
        return res.status(400).send('Error: Webhook verification failed');
    }

    // Handleing the event
    const { id, first_name, last_name } = evt.data as UserJSON;
    const email = (evt.data as UserJSON).email_addresses[0].email_address;

    const eventType = evt.type;

    if (eventType === 'user.created') {
        const user = await User.create({ _id: id, email, first_name ,last_name });
        //giving some default categories to user
        await Category.create({name: "Groceries", type: "expense", userId: user._id});
        await Category.create({name: "Food", type: "expense", userId: user._id});
        await Category.create({name: "Entertainment", type: "expense", userId: user._id});
        await Category.create({name: "Health", type: "expense", userId: user._id});
        await Category.create({name: "Transportation", type: "expense", userId: user._id});
        await Category.create({name: "Utilities", type: "expense", userId: user._id});
        await Category.create({name: "Salary", type: "income", userId: user._id});
        await Category.create({name: "Freelance", type: "income", userId: user._id});
        await Category.create({name: "Side-Hustle", type: "income", userId: user._id});
        await Category.create({name: "Other", type: "expense", userId: user._id});
    }

    res.status(200).send('Webhook received successfully.');
}