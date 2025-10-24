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

   async getAllUsers(
      page: number,
      limit: number,
      search: string
   ): Promise<{ users: IUser[]; totalUsers: number; currentPage: number; totalPages: number }> {
      const skip = (page - 1) * limit;

      // Create search filter
      const searchFilter: any = { role: 'user' };

      if (search) {
         searchFilter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } }
         ];
      }

      // Run queries in parallel
      const [users, totalUsers] = await Promise.all([
         User.find(searchFilter).skip(skip).limit(limit),
         User.countDocuments(searchFilter)
      ]);

      const totalPages = Math.ceil(totalUsers / limit);

      return { users, totalUsers, currentPage: page, totalPages };
   }

   async updateUser(id: string, userData: Partial<IUserProfile>): Promise<void> {
      const update = await userProfile.updateOne(
         { userId: id },
         { $set: userData }
      );

   }
   async updateEmail(userId: string, email: string): Promise<void> {
      await User.findByIdAndUpdate(
         userId,
         { $set: { email } },
         { new: true }
      );
   }
   async updateUserPassword(email: string, hashedPassword: string): Promise<void> {
      await this.updatePassword(email, hashedPassword);
   }
   async checkMobileExists(mobile: string): Promise<boolean> {
      const user = await this.findOne({ mobile });
      return !!user;
   }
   async changePassword(id: string, newPassword: string): Promise<void> {
      await User.findByIdAndUpdate(id, { $set: { password: newPassword } }, { new: true })
   }

}