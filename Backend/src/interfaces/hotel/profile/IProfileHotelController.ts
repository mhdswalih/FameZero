import { Request,Response,NextFunction } from "express";


export interface  IProfileHotelController {
    getHotelProfile(req:Request,res:Response,next:NextFunction):Promise<void>
    updateHotelProfile(req:Request,res:Response,next:NextFunction):Promise<void>
}