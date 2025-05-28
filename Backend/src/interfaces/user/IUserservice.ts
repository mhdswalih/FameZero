import { IUser } from "../../models/usermodel/usermodel";


export interface IUserService {
    registerUser(userData:Partial<IUser>):Promise<{status:number,messege:string}>;
    getUserById(id:string):Promise<IUser>;
    verifyOtp(email: string,otp:string,userData:Partial<IUser>): Promise<{status:number,messege:string}>;
    resendOtp(email:string):Promise<{status:number,messege:string}>
}