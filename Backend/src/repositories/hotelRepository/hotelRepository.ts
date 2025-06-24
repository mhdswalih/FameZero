import { IUser, User } from "../../models/usermodel/userModel";
import { BaseRepository } from "../../repositories/userrepository/baseRepository";
import { IUserRepository } from "../../interfaces/user/IUserRepository";
import { IHotelRepository } from "../../interfaces/hotel/IHotelRepository";

export class HotelRepository extends BaseRepository<IUser> implements IHotelRepository {
   constructor() {
      super(User);
   }

  

   async findByEmail(email: string): Promise<IUser | null> {
      return await this.findOne({ email });
   }

   async findAllHotels(): Promise<IUser[]> {
      return await this.findAll();
   }

   async updateHotel(id: string, userData: Partial<IUser>): Promise<IUser | null> {
      return await this.update(id, userData);
   }

   async updateHotelPassword(id: string, hashedPassword: string): Promise<IUser | null> {
      return await this.update(id, { password: hashedPassword });
   }

   async checkMobileExists(mobile: string): Promise<boolean> {
      const user = await this.findOne({ mobile });
      return !!user;
   }
}