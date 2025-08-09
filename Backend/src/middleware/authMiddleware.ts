import { Request,Response,NextFunction } from "express";
import { createHttpError } from "../utils/httperr";
import { HttpStatus } from "../constants/HttpStatus";
import { Messages } from "../constants/Messeges";
import { User } from "../models/usermodel/userModel";
import  jwt  from "jsonwebtoken";
import { isUserBlackListed } from "../utils/blockuser";

export interface AuthRequst extends Request {
    user?: {
        userId:string;
        role:string
    };
}

export async function authenticateToken(
    req: AuthRequst,
    res: Response,
    next: NextFunction
): Promise<void> {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(HttpStatus.UNAUTHORIZED).json({
            message: Messages.INVALID_OR_EXPIRED_REFRESH_TOKEN
        });
        return;
    }

    try {
        const decode = jwt.verify(token, process.env.ACCESS_SECRET!) as { userId: string; role: string };
        const user = await User.findById(decode.userId);
        
        if (!user) {
            res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.USER_NOT_FOUND });
            return;
        }

        let blockedUser = await isUserBlackListed(user.id);
        if (blockedUser) {
            res.status(HttpStatus.FORBIDDEN).json({
                success: false,
                message: "Your account has been blocked. Please contact support."
            });
            return;
        }

        req.user = decode;
        next();
    } catch (error) {
        res.status(HttpStatus.UNAUTHORIZED).json({
            message: Messages.INVALID_OR_EXPIRED_REFRESH_TOKEN
        });
    }
}
