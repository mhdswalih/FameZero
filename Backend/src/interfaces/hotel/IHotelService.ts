import { IUser } from "../../models/usermodel/userModel";


export interface IHotelService {
    registerHotel(userData:Partial<IUser>):Promise<{status:number,messege:string}>;
    // getHotelById(id:string):Promise<IUser>;
    verifyHotelOtp(email: string,otp:string,userData:Partial<IUser>): Promise<{status:number,messege:string}>;
    // resendOtp(email:string):Promise<{status:number,messege:string}>
    //  loginHotel(email: string, password: string): Promise<{
    //     status: number;
    //     message: string;
    //     accessToken: string;
    //     refreshToken: string;
    //     user?: {
    //         id: string;
    //         name: string;
    //         email: string;
    //         Role:string;
    //     }
    // }>;
}