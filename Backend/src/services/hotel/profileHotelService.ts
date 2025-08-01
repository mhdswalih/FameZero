import { Messages } from "../../constants/Messeges";
import { IProfileHotelRepositer } from "../../interfaces/hotel/profile/IProfileHotelRepository";
import { IProfileHotelService } from "../../interfaces/hotel/profile/IProfileHotelService";
import { IHotelProfile } from "../../models/hotelModel/hotelProfileModel";



export class HotelProfileService implements IProfileHotelService {
    constructor(private _hotelProfileRepository:IProfileHotelRepositer){}
 
    async getHotelProfile(hotelId: string): Promise<IHotelProfile | null> {
        return await this._hotelProfileRepository.findByHotelId(hotelId)
    }
    async updateHotelProfile(userId: string, profileData: Partial<IHotelProfile>): Promise<IHotelProfile | null> {
       try {
         if(!userId){
            throw new Error(Messages.USER_ID_REQUIRED)
        }
        const updateProfile = await this._hotelProfileRepository.updateHotelProfile(userId,profileData)
        if(!updateProfile){
            throw new Error(Messages.USER_NOT_FOUND)
        }
        return updateProfile
       } catch (error) {
        throw error
       }
    }
    
    
}