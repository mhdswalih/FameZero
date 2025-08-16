import { IUser, User } from "../../models/usermodel/userModel";
import { BaseRepository } from "./baseRepository";
import { IUserRepository } from "../../interfaces/user/IUserRepository";
import userProfile, { IUserProfile } from "../../models/usermodel/userProfileModel";


export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
   constructor() {
      super(User);
   }
   async getUserProfile(id: string): Promise<IUserProfile | null> {
      return await userProfile.findOne({ userId: id }).populate('userId')
   }

   async getAllUsers(): Promise<IUser[]> {
      return await User.find({ role: 'user' })

   }
   async updateUser(id: string, userData: Partial<IUserProfile>): Promise<void> {
      const update = await userProfile.updateOne(
         { userId: id },
         { $set: userData }
      );

   }
   async updateEmail(userId: string, email: string): Promise<void> {
      const updateEmail = await User.updateOne({userId:userId},{$set:{email:email}})
   }
   async updateUserPassword(email: string, hashedPassword: string): Promise<void> {
      await this.updatePassword(email, hashedPassword);
   }
   async checkMobileExists(mobile: string): Promise<boolean> {
      const user = await this.findOne({ mobile });
      return !!user;
   }
}