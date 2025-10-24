import { IUser, User } from "../../models/usermodel/userModel";
import { BaseRepository } from "../../repositories/userrepository/baseRepository";
import { IHotelRepository } from "../../interfaces/hotel/IHotelRepository";
import { IHotelFullProfile } from "./hotelInterface";
import hotelProfile from "../../models/hotelModel/hotelProfileModel";
import redisClient from "../../config/redisService";


export class HotelRepository extends BaseRepository<IUser> implements IHotelRepository {
   constructor() {
      super(User);
   }
   async findByEmail(email: string): Promise<IUser | null> {
      return await this.findOne({ email });
   }
   async getAllHotels(
      page: number,
      limit: number,
      search: string
   ): Promise<{ hotels: IHotelFullProfile[]; totalHotels: number; currentPage: number; totalPages: number }> {
      const skip = (page - 1) * limit;

      // Create match stage for filtering
      const matchStage: any = {};

      if (search) {
         matchStage.$or = [
            { name: { $regex: search, $options: 'i' } },
            { city: { $regex: search, $options: 'i' } },
            { location: { $regex: search, $options: 'i' } }
         ];
      }

      const [hotels, totalHotels] = await Promise.all([
         hotelProfile.aggregate([
            { $match: matchStage },
            {
               $lookup: {
                  from: 'users',
                  localField: 'userId',
                  foreignField: '_id',
                  as: 'userDetails'
               }
            },
            { $unwind: '$userDetails' },
            {
               $match: { 'userDetails.role': 'hotel' }
            },
            {
               $project: {
                  _id: 1,
                  userId: '$userDetails._id',
                  name: 1,
                  email: '$userDetails.email',
                  status: 1,
                  phone: 1,
                  location: 1,
                  city: 1,
                  profilepic: 1,
                  idProof: 1,
                  review: 1,
                  rating: 1,
                  isBlocked: '$userDetails.isBlocked'
               }
            },
            { $skip: skip },
            { $limit: limit }
         ]),
         hotelProfile.countDocuments(matchStage)
      ]);

      const totalPages = Math.ceil(totalHotels / limit);

      return { hotels, totalHotels, currentPage: page, totalPages };
   }



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
   async blockHotel(id: string): Promise<IUser | null> {
      try {
         const cleanedId = id.replace(/^:/, '');
         const blockedHotel = await User.findByIdAndUpdate(
            cleanedId,
            { isBlocked: true },
            { new: true }
         );
         await redisClient.sAdd("blacklisted_users", cleanedId);
         return blockedHotel;
      } catch (error) {
         throw error;
      }
   }

   async unBlockHotel(id: string): Promise<boolean> {
      try {
         const status = await User.findByIdAndUpdate(
            id,
            { isBlocked: false },
            { new: true }
         )
         await redisClient.sRem("blacklisted_users", id)
         return true
      } catch (error) {
         throw error
      }
   }

   async updateHotelPassword(id: string, hashedPassword: string): Promise<IUser | null> {
      return await this.update(id, { password: hashedPassword });
   }

   async checkMobileExists(mobile: string): Promise<boolean> {
      const user = await this.findOne({ mobile });
      return !!user;
   }
   async getAllHotelsInUserSide(): Promise<IHotelFullProfile[]> {
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
            $match: { status: 'Approved' }
         },
         {
            $project: {
               userId: '$userDetails._id',
               name: '$name',
               email: '$userDetails.email',
               status: '$status',
               phone: '$phone',
               location: '$location',
               city: '$city',
               profilepic: '$profilepic',
               idProof: '$idProof',
               rating: `$rating`,
               review: `$review`
            }
         }
      ]);

      return hotels as IHotelFullProfile[];
   }
}