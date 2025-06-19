import { NextFunction, Request, Response } from 'express';

export interface IHotelController {
  createHotel(req: Request, res: Response , next:NextFunction): Promise<void>;
//   updateHotel(req: Request, res: Response,next:NextFunction): Promise<void>;
  verifyHotelOtp(req: Request, res: Response,next:NextFunction): Promise<void>;
  // resendOtp(req:Request,res:Response,next:NextFunction):Promise<void>;
//   login(req: Request, res: Response,next:NextFunction): Promise<void>;
//   refreshToken(req: Request, res: Response,next:NextFunction): Promise<void>;
//   checkMobileExists(req: Request, res: Response,next:NextFunction): Promise<void>
}
