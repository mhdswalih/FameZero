import { Request, Response, NextFunction, response } from "express";
import { IUserController } from "../../interfaces/user/IUserController";
import { IUserService } from "../../interfaces/user/IUserservice";
import { HttpStatus } from "../../constants/HttpStatus";
import { Messages } from "../../constants/Messeges";

export class UserController implements IUserController {
    constructor(private _userService: IUserService) { }
    async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this._userService.registerUser(req.body);
            res.status(HttpStatus.CREATED).json({ success: true, message: Messages.USER_CREATED });
        } catch (error) {
            next(error)
        }
    }

    async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, otp, userData } = req.body;
            
           const response =  await this._userService.verifyOtp(email, otp, userData);
           
            res.status(HttpStatus.OK).json({
                message: Messages.EMAIL_VERIFIED
            });
        } catch (error) {
            next(error)
        }
    }
    async resendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email } = req.body;
            const response = await this._userService.resendOtp(email)
            res.status(HttpStatus.OK).json({ message: response.messege })
        } catch (error) {
            next(error)
        }
    }
    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;
            const response = await this._userService.loginUser(email, password)
            
            res.cookie('refreshToken', response.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', 
                sameSite: 'strict', 
                maxAge: 7 * 24 * 60 * 60 * 1000 
            });
            res.status(HttpStatus.OK).json({
                message: response.message,
                accessToken: response.accessToken,
                user: response.user,
            });
        } catch (error:any) {
            next(error)
        }
    }
    async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.clearCookie('refreshToken',{
                 secure: process.env.NODE_ENV === "production",
                sameSite: "none",
            })
            res.status(HttpStatus.OK).json({message:Messages.LOGOUT_SUCCESS})
        } catch (error) {
            next(error)
        }
    }
    async googleLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
           const {googleToken,role} = req.body;  
           const response = await this._userService.googleLogin(googleToken,role) 
           res.cookie('refreshToken', response.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', 
                sameSite: 'strict', 
                maxAge: 7 * 24 * 60 * 60 * 1000 
            });
           res.status(HttpStatus.OK).json({message:response.message,accessToken:response.accessToken,
            user:response.user
           }) 
        } catch (error) {
            next(error)
        }
    }
    async phoneAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {name,phone,role} = req.body 
            const response = await this._userService.phoneAuth(name,phone,role)
              res.cookie('refreshToken', response.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', 
                sameSite: 'strict', 
                maxAge: 7 * 24 * 60 * 60 * 1000 
            });
            
           res.status(HttpStatus.OK).json({message:response.message,accessToken:response.accessToken,
            user:response.user
           }) 
        } catch (error) {
            
        }
    }
    async emailVerifycation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {email} = req.body
            const response = await this._userService.verifyEmail(email)
            res.status(HttpStatus.OK).json({response})
        } catch (error) {
            next(error)
        }
    }
    async otpverificationPhonAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {id} = req.params;
            
            const {email,otp} = req.body
            const response = await this._userService.otpVerifycationPhoneAuth(id,email,otp)
            res.status(HttpStatus.OK).json({response})
        } catch (error) {
            
        }
    }
    async getUserDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params
            const profile = await this._userService.getUserDetails(id)
            if (!profile) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.USER_NOT_FOUND })
            }
            res.status(HttpStatus.OK).json({ profile })
        } catch (error) {
            next(error)
        }
    }
    async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const token = req.cookies?.refreshToken;
            if (!token) {
                res.status(HttpStatus.UNAUTHORIZED).json({
                    success: false,
                    message: 'Refresh token missing'
                });
                return;
            }
            const { accessToken, user } = await this._userService.refreshToken(token);
            res.status(HttpStatus.OK).json({
                success: true,
                response: accessToken,
                user
            });
        } catch (error) {
            next(error);
        }
    }
        async forgetPassWord(req: Request, res: Response, next: NextFunction): Promise<void> {
            try {
                const {email} = req.body;
                const response = await this._userService.forgetPassword(email)
                res.status(HttpStatus.OK).json({success:true,data:response})
            } catch (error) {
                next(error)
            }
        }
    async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {token,newPassword,confirmPassword} =req.body
            
            const response = await this._userService.resetPassword(token,newPassword,confirmPassword)
            res.status(HttpStatus.OK).json({success:true,message:response.message})  
        } catch (error) {
            next(error)
        }
    }    
    async checkMobileExists(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Implement mobile check logic here
            throw new Error('Method not implemented.');
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({
                message: error instanceof Error ? error.message : Messages.UNKNOWN_ERROR,
            });
        }
    }

    async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await this._userService.getUserById(req.params.id);
            res.status(HttpStatus.OK).json(user);
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({
                message: error instanceof Error ? error.message : Messages.UNKNOWN_ERROR,
            });
        }
    }

   
    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            // Implement delete user logic here
            throw new Error('Method not implemented.');
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({
                message: error instanceof Error ? error.message : Messages.UNKNOWN_ERROR,
            });
        }
    }
}