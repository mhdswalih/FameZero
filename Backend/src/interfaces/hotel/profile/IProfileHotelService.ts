import { IHotelProfile } from "../../../models/hotelModel/hotelProfileModel"


export interface IProfileHotelService {
   getHotelProfile(hotelId:string):Promise<IHotelProfile | null> 
   updateHotelProfile(userId:string,profileData:Partial<IHotelProfile>):Promise<IHotelProfile | null>
}