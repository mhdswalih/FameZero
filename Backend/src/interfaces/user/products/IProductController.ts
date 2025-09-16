import { NextFunction, Request,Response } from "express"

export interface IProductController {
    addToCart(req:Request,res:Response,next:NextFunction):Promise<void>
    getCart(req:Request,res:Response,next:NextFunction):Promise<void>
    removeFromCart(req:Request,res:Response,next:NextFunction):Promise<void>
    updateStock(req:Request,res:Response,next:NextFunction):Promise<void>
    getCheckOut(req:Request,res:Response,next:NextFunction):Promise<void>
    createOrder(req:Request,res:Response,next:NextFunction):Promise<void>
    updatePaymentStatus(req: Request, res: Response, next: NextFunction): Promise<void>
    getOrderHistory(req:Request,res:Response,next:NextFunction):Promise<void>
    rePayTheOrder(req:Request,res:Response,next:NextFunction):Promise<void>
    rePayUpdateStatus(req:Request,res:Response,next:NextFunction):Promise<void>
}