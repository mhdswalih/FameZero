import { IUser,User} from "../../models/usermodel/userModel";
import { BaseRepository } from "./baseRepository";
import { IUserRepository } from "../../interfaces/user/IUserRepository";
import userProfile, { IUserProfile } from "../../models/usermodel/userProfileModel";


export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
   constructor() {
      super(User);
   }
   async getUserProfile(id:string):Promise<IUserProfile | null>{
   return await userProfile.findOne({userId: id}).populate('userId')
   }

   async getAllUsers(): Promise<IUser[]> {
      return  await User.find({role:'user'})
     
   }
      async updateUser(id: string, userData: Partial<IUserProfile>): Promise<void> {      
      const update = await userProfile.updateOne(
         {userId: id},
         {$set: userData}
      );

      }


   async updateUserPassword(id: string, hashedPassword: string): Promise<IUser | null> {
      return await this.update(id, { password: hashedPassword });
   }

   async checkMobileExists(mobile: string): Promise<boolean> {
      const user = await this.findOne({ mobile });
      return !!user;
   }
}