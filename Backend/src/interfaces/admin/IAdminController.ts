import { NextFunction,Request,Response } from "express";

export interface IAdminController {
      login(req: Request, res: Response,next:NextFunction): Promise<void>;
      getAllUsers(req:Request,res:Response,next:NextFunction):Promise<void>;
      getAllHotels(req:Request,res:Response,next:NextFunction):Promise<void>;
      acceptRequst(req:Request,res:Response,next:NextFunction):Promise<void>;
      rejectRequst(req:Request,res:Response,next:NextFunction):Promise<void>;
}