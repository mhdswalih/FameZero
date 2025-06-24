import { IProfileHotelRepositer } from "../../interfaces/hotel/profile/IProfileHotelRepository";
import hotelProfile, { IHotelProfile } from "../../models/hotelModel/hotelProfileModel";
import { BaseRepository } from "../userrepository/baseRepository";



export class HotelProfileRepository extends BaseRepository<IHotelProfile> implements IProfileHotelRepositer{
    constructor(){
        super(hotelProfile)
    }
    async create(data: Partial<IHotelProfile>): Promise<IHotelProfile> {
        return await this.model.create(data)
    }
    // async findByHotelId(userId: string): Promise<IHotelProfile | null> {
    //     return await this.model.findOne({ userId }).exec();
    // }
    // async updateHotelProfile(userId: string, profileData: Partial<IHotelProfile>): Promise<IHotelProfile | null> {
    //     return await this.model.findOneAndUpdate(
    //         { userId },
    //         { $set: profileData },
    //         { new: true, upsert: true, runValidators: true }
    //     );
    // }
}