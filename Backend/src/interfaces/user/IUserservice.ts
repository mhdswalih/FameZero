import { IUser } from "../../models/usermodel/userModel";
import { IUserProfile } from "../../models/usermodel/userProfileModel";


export interface IUserService {
    registerUser(userData: Partial<IUser>): Promise<{ status: number, messege: string }>;
    getUserById(id: string): Promise<IUser>;
    getUserDetails(id: string): Promise<IUser>
    verifyOtp(email: string, otp: string, userData: Partial<IUser>): Promise<{ status: number, messege: string }>;
    resendOtp(email: string): Promise<{ status: number, messege: string }>
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
    googleLogin(googleToken: string, role: string): Promise<{
        status: number;
        message: string;
        accessToken: string;
        refreshToken: string
        user: {
            id: string;
            name: string;
            email: string;
            profilepic: string;
            role: string;
        }
    }>;
    phoneAuth(name: string, phone: string, role: string): Promise<{
        status: number;
        message: string;
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            profilepic: string;
            role: string;
        }
    }>
    verifyEmail(email:string):Promise<{status:number,messege:string}>
    otpVerifycationPhoneAuth(id:string,email:string,otp:string):Promise<{status:number,messege:string}>
    updateUser(id: string, userProfile: Partial<IUserProfile>): Promise<void>
    refreshToken(token: string): Promise<{ accessToken: string; user: { id: string; email: string; role: string } }>;
    forgetPassword(email: string): Promise<{ message: string }>;
    resetPassword(token: string, newPassword: string, confirmPassword: string): Promise<{ message: string }>
}