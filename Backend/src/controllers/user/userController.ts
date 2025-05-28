import { Request, Response ,NextFunction} from "express";
import { IUserController } from "../../interfaces/user/IUserController";
import { IUserService } from "../../interfaces/user/IUserservice";
import { HttpStatus } from "../../constants/HttpStatus";
import { Messages } from "../../constants/Messeges";


export class UserController implements IUserController {
    constructor(private _userService: IUserService) {}
    async createUser(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            await this._userService.registerUser(req.body);
            res.status(HttpStatus.CREATED).json({success:true, message: Messages.USER_CREATED });
        } catch (error) {
            next(error)
        }
    }

    async verifyOtp(req: Request, res: Response ,next:NextFunction): Promise<void> {
        try {
            const {email,otp,userData} = req.body;            
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
            const {email} = req.body;
            const response = await this._userService.resendOtp(email)
            res.status(HttpStatus.OK).json({message:response.messege})
        } catch (error) {
            next(error)
        }
    }
    async login(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            // Implement login logic here
            throw new Error('Method not implemented.');
        } catch (error) {
          next(error)
        }
    }

    async refreshToken(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            // Implement refresh token logic here
            throw new Error('Method not implemented.');
        } catch (error) {
           next(error)
        }
    }

    async checkMobileExists(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            // Implement mobile check logic here
            throw new Error('Method not implemented.');
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({
                message: error instanceof Error ? error.message : Messages.UNKNOWN_ERROR,
            });
        }
    }

    async getUser(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            const user = await this._userService.getUserById(req.params.id);
            res.status(HttpStatus.OK).json(user);
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({
                message: error instanceof Error ? error.message : Messages.UNKNOWN_ERROR,
            });
        }
    }

    async updateUser(req: Request, res: Response ,next:NextFunction): Promise<void> {
        try {
            // Implement update user logic here
            throw new Error('Method not implemented.');
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