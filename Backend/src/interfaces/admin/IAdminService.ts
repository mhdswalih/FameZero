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
    getAllUsers(page : number, limit:number,search:string):Promise<{ users: IUser[]; totalPages: number; currentPage: number ,search:string}>
    getAllHotels(page:number, limit : number,search : string):Promise<{ hotels: IHotelFullProfile[]; totalPages: number; currentPage: number,search:string }>
    acceptRequst(id:string):Promise<IHotelFullProfile | null>
    rejectRequst(id:string):Promise<IHotelFullProfile | null>
    blockHotel(id:string):Promise<IUser | null>;
    unBlockHotel(id:string):Promise<boolean>

}