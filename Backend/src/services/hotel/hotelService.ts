
import { IHotelService } from "../../interfaces/hotel/IHotelService";
import { IUser } from "../../models/usermodel/userModel";
import { HotelRepository } from "../../repositories/hotelRepository/hotelRepository";
import { Messages } from "../../constants/Messeges";
import { createHttpError } from "../../utils/httperr";
import { HttpStatus } from "../../constants/HttpStatus";
import { generateOTP } from "../../utils/otputils";
import { deleteOtp, sendOtp, storeOtp, verifyOtp } from "../../utils/otp";
import { hashPassword } from "../../utils/hashPassword";


export class HotelService implements IHotelService{
    constructor(private _hotelRepository:HotelRepository){}

    async registerHotel(userData: Partial<IUser>): Promise<{ status: number; messege: string; }> {
        console.log(userData,'tis is user data');
        
        if(!userData.email){
            throw createHttpError(HttpStatus.BAD_REQUEST,Messages.EMAIL_REQUIRED)
        }
        const existingHotel = await this._hotelRepository.findByEmail(userData.email);
        
        if(existingHotel){
            throw createHttpError(HttpStatus.BAD_REQUEST,Messages.USER_EXISTS)
        }
        if(!userData.name || !userData.password){
            throw createHttpError(HttpStatus.BAD_REQUEST,Messages.INVALID_CREDENTIALS)
        }
        if(userData.password.length < 8){
            throw createHttpError(HttpStatus.BAD_REQUEST,Messages.PASSWORD_LENGTH)
        }

        const otp = generateOTP()
        await sendOtp(userData?.email,otp)
        await storeOtp(userData?.email,otp)
        return {status :HttpStatus.OK,messege:Messages.OTP_SENT}
    }
       async verifyHotelOtp(email: string,otp:string,userData:Partial<IUser>):Promise<{status:number,messege:string}> {
           const validOtp = await  verifyOtp(email,otp)
           if(!validOtp.success){
               throw createHttpError(HttpStatus.BAD_REQUEST,Messages.OTP_INVALID)
               
           }
           if(!userData.password){
               throw new Error(Messages.INVALID_CREDENTIALS)
           }
           userData.password = await hashPassword(userData.password)
           const hotel = await this._hotelRepository.create(userData as IUser);
           await deleteOtp(email)
           return {status:HttpStatus.CREATED,messege:Messages.USER_CREATED}
           // throw new Error('Method not implemented.');
       }
}