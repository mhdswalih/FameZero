import { IUser } from "../../models/usermodel/userModel";


export interface IUserService {
    registerUser(userData:Partial<IUser>):Promise<{status:number,messege:string}>;
    getUserById(id:string):Promise<IUser>;
    verifyOtp(email: string,otp:string,userData:Partial<IUser>): Promise<{status:number,messege:string}>;
    resendOtp(email:string):Promise<{status:number,messege:string}>
     loginUser(email: string, password: string): Promise<{
        status: number;
        message: string;
        accessToken: string;
        refreshToken: string;
        user?: {
            id: string;
            name: string;
            email: string;
        }
    }>;
}