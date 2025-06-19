import { Request, Response, NextFunction } from "express";
import { IAdminController } from "../../interfaces/admin/IAdminController";
import { IAdminService } from "../../interfaces/admin/IAdminService";
import { HttpStatus } from "../../constants/HttpStatus";



export class adminController implements IAdminController {
    constructor(private _AdminService:IAdminService){}
   async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {email,password} = req.body;
            const response = await this._AdminService.loginAdmin(email,password)
            res.cookie('refreshToken',response.refreshToken,{
                httpOnly:true,
                sameSite:'none',
                maxAge:7 * 24 * 60 * 60 * 1000,
            })
            res.status(HttpStatus.OK).json({
                message:response.message,
                accessToken:response.accessToken,
                admin:response.admin
            })
        } catch (error) {
            next(error)
        }
    }
    async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const users = await this._AdminService.getAllUsers()
            console.log(users,'this is user for admin side');
            
            res.status(HttpStatus.OK).json({success:true,data:users})
        } catch (error) {
            next(error)
        }
    }
}