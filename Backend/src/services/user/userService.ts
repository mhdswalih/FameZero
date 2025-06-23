import { HttpStatus } from '../../constants/HttpStatus';
import { Messages } from '../../constants/Messeges';
import { IUserRepository } from '../../interfaces/user/IUserRepository';
import { IUserService } from '../../interfaces/user/IUserservice';
import { IUser } from '../../models/usermodel/userModel';
import { deleteOtp, sendOtp, storeOtp } from '../../utils/otp';
import { generateOTP } from '../../utils/otputils';
import { verifyOtp } from '../../utils/otp';
import { createHttpError } from '../../utils/httperr';
import  {comparePassword, hashPassword } from '../../utils/hashPassword';
import { genrateAccessToken, genrateRefreshToken, veryfyAccessToken } from '../../utils/jwt';
import { IUserProfile } from '../../models/usermodel/userProfileModel';
import { IProfileRepositer } from '../../interfaces/user/profile/IProfileRepository';


export class UserService implements IUserService  {
    constructor(private _userRepository: IUserRepository,private _profileUserRepository:IProfileRepositer ) {}

    async registerUser(userData: Partial<IUser>): Promise<{status:number,messege:string}> {
            if (!userData.email) {
                throw new Error(Messages.MESSAGES_REQUIRED);
            }
            const existingUser = await this._userRepository.findByEmail(userData.email);
            const commonPattern: RegExp = /^(123456|123456789|12345678|12345|111111|123123|qwerty|abc123|password|password1)$/i;

            if (existingUser) {
                throw createHttpError(HttpStatus.BAD_REQUEST,Messages.USER_EXISTS);
            }
            if (!userData.name || !userData.password ) {
               throw createHttpError(HttpStatus.BAD_REQUEST,Messages.INVALID_CREDENTIALS);
            }
            if(userData.password.length < 8){
                throw createHttpError(HttpStatus.BAD_REQUEST,Messages.PASSWORD_LENGTH)
            }
            if(commonPattern.test(userData.password)){
                throw createHttpError(HttpStatus.BAD_REQUEST,Messages.PASSWORD_COMMEN)
            }

            const otp = generateOTP();
            await sendOtp(userData?.email,otp)
            await storeOtp(userData?.email,otp)
            return {status:HttpStatus.OK,messege:Messages.OTP_SENT}
        
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
        const user = await this._userRepository.create(userData as IUser) as IUser;
        await deleteOtp(email)
        if(user.role === 'user'){  
            await this._profileUserRepository.create({
                userId: user._id as any,
                name : user.name,
                email:user.email,
                profilepic: '',
                address1:'',
                address2:'',
                city:'',
                phone:'',
                zipcode:'',
            })
        }
        return {status:HttpStatus.CREATED,messege:Messages.USER_CREATED}
    }
    async resendOtp (email: string): Promise<{ status: number; messege: string; }> {
        await deleteOtp(email)
        const newOTP = generateOTP()
        await sendOtp(email,newOTP)
        await storeOtp(email,newOTP)
        return {status:HttpStatus.OK,messege:Messages.OTP_SENT}
    }
    async loginUser(email: string, password: string): Promise<{
        status: number;
        message: string;  
        accessToken: string;
        refreshToken: string;
        user?: {
            id: string,
            name: string,
            email: string,
            role:string,
        }
    }> {
        const user = await this._userRepository.findByEmail(email)
        if (!user) throw createHttpError(HttpStatus.BAD_REQUEST, Messages.USER_NOT_FOUND)

        const isValid = await comparePassword(password, user.password)
        if (!isValid) {
            
            throw createHttpError(HttpStatus.UNAUTHORIZED, Messages.INVALID_PASSWORD)
        }

        
        const accessToken = genrateAccessToken(user.id.toString())
        const refreshToken = genrateRefreshToken(user.id.toString())

        return {
            status: HttpStatus.OK,
            message: Messages.LOGIN_SUCCESS,  
            accessToken,
            refreshToken,
            user: {
                id: user.id.toString(),
                name: user.name,  
                email: user.email,
                role:user.role
            }
        }
    }
    async getUserDetails(id: string): Promise<IUser> {
        const profile = await this._userRepository.findById(id)
         if(!profile){
                throw createHttpError(HttpStatus.BAD_REQUEST,Messages.USER_NOT_FOUND)
            }
            return profile 
    }
    async updateUser(id: string, userProfile: Partial<IUserProfile>): Promise<void> {
        // console.log(userProfile,'this is user profile from service');
        
        const userId = await this._userRepository.findById(id)
        if(!userId){
            throw createHttpError(HttpStatus.BAD_REQUEST,Messages.INVALID_USER_ID)
        }
        return await this._userRepository.updateUser(id,userProfile)
    }

}