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
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string || ""
            const usersData = await this._AdminService.getAllUsers(page, limit,search);

            res.status(200).json({
                success: true,
                data: usersData.users,
                totalPages: usersData.totalPages,
                currentPage: usersData.currentPage
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllHotels(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string || ""

            const { hotels, totalPages, currentPage,  } = await this._AdminService.getAllHotels(page, limit,search);

            res.status(HttpStatus.OK).json({
                success: true,
                data: {
                    hotels,
                    totalPages,
                    currentPage,
                    search
                },
            });
        } catch (error) {
            next(error);
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
    async unBlockHotel(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const status = await this._AdminService.unBlockHotel(id)
            res.status(HttpStatus.OK).json(status)
        } catch (error) {
            next(error)
        }
    }
}
