import { IHotelProfile } from "../../../models/hotelModel/hotelProfileModel";
import { IBaseRepository } from "../../baserepo/IbaseRepo";

export interface IProfileHotelRepositer extends IBaseRepository<IHotelProfile> {
     create(date:Partial<IHotelProfile>):Promise<IHotelProfile>;
     // findByHotelId(userId:string):Promise<IHotelProfile | null> 
     // updateHotelProfile(userId:string,profileData:Partial<IHotelProfile>):Promise<IHotelProfile | null>;
  
}


