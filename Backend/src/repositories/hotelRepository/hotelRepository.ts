import { IUser, User } from "../../models/usermodel/userModel";
import { BaseRepository } from "../../repositories/userrepository/baseRepository";
import { IHotelRepository } from "../../interfaces/hotel/IHotelRepository";
import { IHotelFullProfile } from "./hotelInterface";
import hotelProfile from "../../models/hotelModel/hotelProfileModel";


export class HotelRepository extends BaseRepository<IUser> implements IHotelRepository {
   constructor() {
      super(User);
   }
   async findByEmail(email: string): Promise<IUser | null> {
      return await this.findOne({ email });
   }
   async getAllHotels(): Promise<IHotelFullProfile[]> {
      const hotels = await hotelProfile.aggregate([
         {
            $lookup: {
               from: 'users',
               localField: 'userId',
               foreignField: '_id',
               as: 'userDetails'
            }
         },
         {
            $unwind: '$userDetails'
         },
         {
            $project: {
               name: '$name',
               email: '$userDetails.email',
               status: '$status',
               phone: '$phone',
               location: '$location',
               city: '$city',
               profilepic: '$profilepic',
               idProof: '$idProof'
            }
         }
      ]);

      return hotels as IHotelFullProfile[];
   };
   async updateHotel(id: string, userData: Partial<IUser>): Promise<IUser | null> { 
      return await this.update(id, userData);
   }
   async acceptRequstHotel(id: string): Promise<IHotelFullProfile | null> {
      const cleanedId = id.replace(/^:/, '');
      return await hotelProfile.findByIdAndUpdate(
         cleanedId,
         { status: 'Approved' },
         { new: true }
      );
   }
   async rejectRequstHotel(id: string): Promise<IHotelFullProfile | null> {
      const cleanedId = id.replace(/^:/, '');
      return await hotelProfile.findByIdAndUpdate(
         cleanedId,
         { status: 'Rejected' },
         { new: true }
      );
   }
   async updateHotelPassword(id: string, hashedPassword: string): Promise<IUser | null> {
      return await this.update(id, { password: hashedPassword });
   }

   async checkMobileExists(mobile: string): Promise<boolean> {
      const user = await this.findOne({ mobile });
      return !!user;
   }
}