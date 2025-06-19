import { IUser } from "../../models/usermodel/userModel";

export interface IAdminService  {
    loginAdmin(email:string,password:string) :Promise<{
        status: number;
        message: string;
        accessToken: string;
        refreshToken: string;
        admin?: {
            id: string;
            email: string;
        }
    }>
    getAllUsers():Promise<IUser[]>
}