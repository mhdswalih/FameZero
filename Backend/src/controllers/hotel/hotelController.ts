import { Request, Response, NextFunction } from "express";
import { IHotelController } from "../../interfaces/hotel/IHotelController";
import { IHotelService } from "../../interfaces/hotel/IHotelService";
import { HttpStatus } from "../../constants/HttpStatus";
import { Messages } from "../../constants/Messeges";



export class HotelController implements IHotelController {
    constructor(private _HotelService:IHotelService){}
    async createHotel(req: Request, res: Response, next: NextFunction): Promise<void> {    
        try {
            await this._HotelService.registerHotel(req.body.userData)
            res.status(HttpStatus.CREATED).json({success:true,messeges:Messages.USER_CREATED})
        } catch (error) {
            next(error)
        }
    }
    async verifyHotelOtp(req: Request, res: Response ,next:NextFunction): Promise<void> {
        try {
            const {email,otp,userData} = req.body;            
            await this._HotelService.verifyHotelOtp(email, otp, userData);
            res.status(HttpStatus.OK).json({ 
                message: Messages.EMAIL_VERIFIED 
            });
        } catch (error) {
              next(error)
        }
    }
}
