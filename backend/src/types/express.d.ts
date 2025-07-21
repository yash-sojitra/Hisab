//extending Express default Request type to acoomodate auth parameters
declare namespace Express {
    interface Request {
        auth?: {
            userId: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    }
}