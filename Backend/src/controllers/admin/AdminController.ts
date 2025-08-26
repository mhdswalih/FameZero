import { Request, Response, NextFunction } from "express";
import { IAdminController } from "../../interfaces/admin/IAdminController";
import { IAdminService } from "../../interfaces/admin/IAdminService";
import { HttpStatus } from "../../constants/HttpStatus";
import { emitToHotel } from '../../middleware/soket.io'

export class adminController implements IAdminController {
    constructor(private _AdminService: IAdminService) { }
    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;
            const response = await this._AdminService.loginAdmin(email, password)
            res.cookie('refreshToken', response.refreshToken, {
                httpOnly: true,
                sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            res.status(HttpStatus.OK).json({
                message: response.message,
                accessToken: response.accessToken,
                admin: response.admin
            })
        } catch (error) {
            next(error)
        }
    }
    async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const users = await this._AdminService.getAllUsers()
            res.status(HttpStatus.OK).json({ success: true, data: users })
        } catch (error) {
            next(error)
        }
    }
    async getAllHotels(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const hotels = await this._AdminService.getAllHotels()
            res.status(HttpStatus.OK).json({ success: true, data: hotels })
        } catch (error) {
            next(error)
        }
    }
    async acceptRequst(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const status = await this._AdminService.acceptRequst(id);

            // Use global socket instance
            const cleanedId = id.replace(/^:/, '');
            const emitted = emitToHotel(cleanedId, "Approved");
            res.status(200).json({
                success: true,
                data: status,
                socketEmitted: emitted
            });
        } catch (error) {
            next(error);
        }
    }


    async rejectRequst(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params
            const status = await this._AdminService.rejectRequst(id)
            const cleanedId = id.replace(/^:/, '');
            const emitted = emitToHotel(cleanedId, "Rejected");
            res.status(HttpStatus.OK).json({ success: true, data: status, socketEmitted: emitted })
        } catch (error) {
            next(error)
        }
    }
    async blockHotel(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params
            const status = await this._AdminService.blockHotel(id)
            res.status(HttpStatus.OK).json({ success: true, data: status })
        } catch (error) {
            next(error)
        }
    }

}
