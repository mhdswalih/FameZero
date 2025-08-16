import { NextFunction, Request, Response } from 'express';

export interface IUserController {
  createUser(req: Request, res: Response , next:NextFunction): Promise<void>;
  getUserDetails(req:Request,res:Response,next:NextFunction):Promise<void>;
  verifyOtp(req: Request, res: Response,next:NextFunction): Promise<void>;
  resendOtp(req:Request,res:Response,next:NextFunction):Promise<void>;
  login(req: Request, res: Response,next:NextFunction): Promise<void>;
  logout(req:Request,res:Response,next:NextFunction):Promise<void>
  googleLogin(req:Request,res:Response,next:NextFunction):Promise<void>;
  phoneAuth(req:Request,res:Response,next:NextFunction):Promise<void>;
  emailVerifycation(req:Request,res:Response,next:NextFunction):Promise<void>
  otpverificationPhonAuth(req:Request,res:Response,next:NextFunction):Promise<void>
  refreshToken(req: Request, res: Response,next:NextFunction): Promise<void>;
  checkMobileExists(req: Request, res: Response,next:NextFunction): Promise<void>
  forgetPassWord(req:Request,res:Response,next:NextFunction):Promise<void>;
  resetPassword(req:Request,res:Response,next:NextFunction):Promise<void>;

}
