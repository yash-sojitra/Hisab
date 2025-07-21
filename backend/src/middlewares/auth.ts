import { Clerk, ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

//clerk authentication middleware
export const clerkAuthMiddleware = ClerkExpressWithAuth() as any;