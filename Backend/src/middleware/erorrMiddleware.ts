import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/httperr";
import { HttpStatus } from "../constants/HttpStatus";
import { Messages } from "../constants/Messeges";


export const errorHandler = (err: HttpError | Error, req: Request, res: Response, next: NextFunction) => {
    console.log("Error caught in ERROR MIDDLEWARE :", err);
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR || 500
    let message = Messages.SERVER_ERR

    if (err instanceof HttpError) {
        statusCode = err.statusCode
        message = err.message
    } else {
        console.log('Unhanled', err);
    }
    res.status(statusCode).json({error: message})
}

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    next(new HttpError(Messages.INVALID_REQUST, HttpStatus.NOT_FOUND))
};