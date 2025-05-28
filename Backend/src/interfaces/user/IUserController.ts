import { NextFunction, Request, Response } from 'express';

export interface IUserController {
  createUser(req: Request, res: Response , next:NextFunction): Promise<void>;
  updateUser(req: Request, res: Response,next:NextFunction): Promise<void>;
  verifyOtp(req: Request, res: Response,next:NextFunction): Promise<void>;
  resendOtp(req:Request,res:Response,next:NextFunction):Promise<void>;
  login(req: Request, res: Response,next:NextFunction): Promise<void>;
  refreshToken(req: Request, res: Response,next:NextFunction): Promise<void>;
  checkMobileExists(req: Request, res: Response,next:NextFunction): Promise<void>
}
