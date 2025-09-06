import { NextFunction, Request,Response } from "express"

export interface IProductController {
    addToCart(req:Request,res:Response,next:NextFunction):Promise<void>
    getCart(req:Request,res:Response,next:NextFunction):Promise<void>
    removeFromCart(req:Request,res:Response,next:NextFunction):Promise<void>
    updateStock(req:Request,res:Response,next:NextFunction):Promise<void>
}