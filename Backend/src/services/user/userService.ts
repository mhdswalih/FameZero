import { HttpStatus } from '../../constants/HttpStatus';
import { Messages } from '../../constants/Messeges';
import { IUserRepository } from '../../interfaces/user/IUserRepository';
import { IUserService } from '../../interfaces/user/IUserservice';
import { IUser } from '../../models/usermodel/usermodel';
import { deleteOtp, sendOtp, storeOtp } from '../../utils/otp';
import { generateOTP } from '../../utils/otputils';
import { verifyOtp } from '../../utils/otp';
import { createHttpError } from '../../utils/httperr';
import hashPassword from '../../utils/hashPassword';

export class UserService implements IUserService  {
    constructor(private _userRepository: IUserRepository) {}

    async registerUser(userData: Partial<IUser>): Promise<{status:number,messege:string}> {
        try {
            if (!userData.email) {
                throw new Error(Messages.MESSAGES_REQUIRED);
            }
            const existingUser = await this._userRepository.findByEmail(userData.email);
            if (existingUser) {
                throw new Error(Messages.USER_EXISTS);
            }
            if (!userData.name || !userData.password) {
                throw new Error(Messages.USER_NOT_FOUND);
            }
            const otp = generateOTP();
            await sendOtp(userData?.email,otp)
            await storeOtp(userData?.email,otp)
            return {status:HttpStatus.OK,messege:Messages.OTP_SENT}
        } catch (error: any) {
            throw new Error(`Error registering user: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async getUserById(id: string): Promise<IUser> {
        try {
            const user = await this._userRepository.findById(id);
            if (!user) {
                throw new Error(Messages.USER_NOT_FOUND);
            }
            return user;
        } catch (error: any) {
            throw new Error(`Error getting user: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async verifyOtp(email: string,otp:string,userData:Partial<IUser>):Promise<{status:number,messege:string}> {
        const validOtp = await verifyOtp(email,otp)
        if(!validOtp.success){
            throw createHttpError(HttpStatus.BAD_REQUEST,Messages.OTP_INVALID)
            
        }
        if(!userData.password){
            throw new Error('Password Requird')
        }
         userData.password = await hashPassword(userData.password)
        const user = await this._userRepository.create(userData as IUser);
        await deleteOtp(email)
        return {status:HttpStatus.CREATED,messege:Messages.USER_CREATED}
        // throw new Error('Method not implemented.');
    }
    async resendOtp (email: string): Promise<{ status: number; messege: string; }> {
        await deleteOtp(email)
        const newOTP = generateOTP()
        await sendOtp(email,newOTP)
        await storeOtp(email,newOTP)
        return {status:HttpStatus.OK,messege:Messages.OTP_SENT}
    }
}