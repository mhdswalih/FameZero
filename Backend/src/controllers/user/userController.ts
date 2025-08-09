import { Request, Response, NextFunction } from "express";
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
            await this._userService.verifyOtp(email, otp, userData);
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
        } catch (error) {
            next(error)
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

    // async updateUser(req: Request, res: Response ,next:NextFunction): Promise<void> {
    //     try {
    //         const {id} = req.params;
    //         console.log(id,'this is id from con');

    //         const {userProfile} = req.body
    //         console.log(userProfile,'this is from contrrollerererere');

    //          const profile = await this._userService.updateUser(id,userProfile)
    //          console.log(profile);

    //          res.status(HttpStatus.OK).json({data:profile})
    //     } catch (error) {
    //         res.status(HttpStatus.BAD_REQUEST).json({
    //             message: error instanceof Error ? error.message : Messages.UNKNOWN_ERROR,
    //         });
    //     }
    // }

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