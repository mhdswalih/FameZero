import { Request,Response,NextFunction } from "express";


export interface  IProfileHotelController {
    getHotelProfile(req:Request,res:Response,next:NextFunction):Promise<void>
    updateHotelProfile(req:Request,res:Response,next:NextFunction):Promise<void>
    reRequstProfile(req:Request,res:Response,next:NextFunction):Promise<void>
    changePassword(req:Request,res:Response,next:NextFunction):Promise<void>
    addProducts(req:Request,res:Response,next:NextFunction):Promise<void>
    getAllMenu(req:Request,res:Response,next:NextFunction):Promise<void>
    getOrderList(req:Request,res:Response,next:NextFunction):Promise<void>
    updateOrderStatus(req:Request,res:Response,next:NextFunction):Promise<void>
    deleteProducts(req:Request,res:Response,next:NextFunction):Promise<void>
    updateProducts(req:Request,res:Response,next:NextFunction):Promise<void>
}