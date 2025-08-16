import { Response } from "express";
export class HttpError extends Error{
    statusCode:number;
    constructor(message:string,statusCode:number){
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this,this.constructor)
    }
}


export const createHttpError = (statusCode:number,message:string) =>{
    return new
    HttpError(message,statusCode)
    
}

export const handleError = (res:Response,error:any) =>{
    const statusCode = error.statusCode || 500
    const message = error.messege || 'somting went wrong'
    res.status(statusCode).json({success:false,message})
}