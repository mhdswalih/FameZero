import { IHotelProfile } from "../../models/hotelModel/hotelProfileModel";
import { IUser } from "../../models/usermodel/userModel";
import { IHotelFullProfile } from "../../repositories/hotelRepository/hotelInterface";
import { IBaseRepository } from "../baserepo/IbaseRepo";

export interface IHotelRepository extends IBaseRepository<IUser> {
    getAllHotels():Promise<IHotelFullProfile[]>;
    findByEmail(email: string): Promise<IUser | null>;
    acceptRequstHotel(id:string):Promise<IHotelFullProfile | null>
    rejectRequstHotel(id:string):Promise<IHotelFullProfile | null>
}   