import { IUser } from "../../models/usermodel/userModel";
import { IHotelFullProfile } from "../../repositories/hotelRepository/hotelInterface";

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
    getAllHotels():Promise<IHotelFullProfile[]>
    acceptRequst(id:string):Promise<IHotelFullProfile | null>
    rejectRequst(id:string):Promise<IHotelFullProfile | null>
}